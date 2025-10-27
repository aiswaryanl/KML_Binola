import threading
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import OJTScore, Score, SkillMatrix, TraineeInfo, MasterTable, Station, HierarchyStructure


def run_after_delay(func, delay, *args, **kwargs):
    """Run a function after N seconds without blocking request"""
    timer = threading.Timer(delay, func, args=args, kwargs=kwargs)
    timer.start()


# def update_skill_matrix(employee, station, level, verbose=True):
#     """
#     Update SkillMatrix when both OJT and Evaluation are passed
#     """
#     if verbose:
#         print("=" * 80)
#         print(f"[SkillMatrix] Checking update for Employee: {employee.emp_id}, "
#               f"Station: {station.station_name if station else '❌ None'}, "
#               f"Level: {level.level_name if level else '❌ None'}")

#     # ✅ Get TraineeInfo
#     trainee_info = TraineeInfo.objects.filter(emp_id=employee.emp_id).first()
#     if not trainee_info:
#         if verbose:
#             print(f"[SkillMatrix][ERROR] No TraineeInfo found for Employee: {employee.emp_id}")
#             print("=" * 80)
#         return

#     if verbose:
#         print(f"[SkillMatrix] Found TraineeInfo → Name: {trainee_info.trainee_name}, "
#               f"Status: {trainee_info.status}, DOJ: {trainee_info.doj}")

#     # -------------------------
#     # Check if OJT is passed
#     # -------------------------
#     ojt_pass = False
#     if trainee_info.status == "Pass":
#         ojt_exists = OJTScore.objects.filter(
#             trainee__emp_id=employee.emp_id,
#             topic__level=level
#         ).exists()
#         ojt_pass = ojt_exists
#         if verbose:
#             print(f"[SkillMatrix] OJT status=Pass, OJTScore exists for this level: {ojt_exists}")
#     else:
#         if verbose:
#             print(f"[SkillMatrix] OJT not passed → Trainee status is {trainee_info.status}")

#     if verbose:
#         print(f"[SkillMatrix] Final OJT passed = {ojt_pass}")

#     # -------------------------
#     # Check if Evaluation is passed
#     # -------------------------
#     eval_pass = Score.objects.filter(
#         employee=employee,
#         skill=station,
#         level=level,
#         passed=True
#     ).exists()
#     if verbose:
#         print(f"[SkillMatrix] Evaluation passed = {eval_pass}")

#     # -------------------------
#     # Update or create SkillMatrix
#     # -------------------------
#     if ojt_pass and eval_pass:
#         hierarchy = HierarchyStructure.objects.filter(station=station).first()
#         if not hierarchy:
#             if verbose:
#                 print(f"[SkillMatrix][ERROR] No HierarchyStructure found for Station: {station.station_name}")
#                 print("=" * 80)
#             return

#         obj, created = SkillMatrix.objects.update_or_create(
#             employee=employee,
#             level=level,
#             defaults={
#                 "employee_name": trainee_info.trainee_name,
#                 "emp_id": trainee_info.emp_id,
#                 "doj": trainee_info.doj,
#                 "hierarchy": hierarchy,
#             }
#         )
#         if verbose:
#             if created:
#                 print(f"[SkillMatrix] ✅ SkillMatrix created for Employee: {employee.emp_id}")
#             else:
#                 print(f"[SkillMatrix] 🔄 SkillMatrix updated for Employee: {employee.emp_id}")
#     else:
#         if verbose:
#             print(f"[SkillMatrix] ❌ Not updating. Conditions → OJT: {ojt_pass}, Eval: {eval_pass}")

#     if verbose:
#         print("=" * 80)
def update_skill_matrix(employee, station, level, verbose=True):
    """
    Update SkillMatrix when both OJT and Evaluation are passed
    Update SkillMatrix when OJT (for THIS station/level), Evaluation, AND Ten Cycle are all passed
    """
    if verbose:
        print("=" * 80)
        print(f"[SkillMatrix] Checking update for Employee: {employee.emp_id}, "
              f"Station: {station.station_name if station else '❌ None'}, "
              f"Level: {level.level_name if level else '❌ None'}")

    # ✅ Get TraineeInfo

    # ✅ Get TraineeInfo (Needed for name/doj and general status logging)
    # Filter by emp_id AND the specific station being certified to get the relevant record.
    # If the TraineeInfo record is unique per employee, we must fetch the correct one.
    # Since TraineeInfo has a ForeignKey to Station, we must use the 'station' parameter.

    # trainee_info = TraineeInfo.objects.filter(emp_id=employee.emp_id).first()
    
    trainee_info = TraineeInfo.objects.filter(emp_id=employee.emp_id, station=station).first()
    
    if not trainee_info:
        if verbose:
            # print(f"[SkillMatrix][ERROR] No TraineeInfo found for Employee: {employee.emp_id}")
            print(f"[SkillMatrix][ERROR] No TraineeInfo found for Employee: {employee.emp_id} at Station: {station.station_name}")
            # If no TraineeInfo exists for this station/skill, OJT cannot be complete.
            print("=" * 80)
        return

    if verbose:
        print(f"[SkillMatrix] Found TraineeInfo → Name: {trainee_info.trainee_name}, "
              f"Status: {trainee_info.status}, DOJ: {trainee_info.doj}")

    # -------------------------
    # Check if OJT is passed for THIS Station/Level
    # -------------------------
    ojt_pass = False
    
    # CRITICAL CHANGE: We rely on the TraineeInfo.status only if it applies to this station.
    # The TraineeInfoViewSet logic is now responsible for setting this status correctly 
    # based on OJT scores associated with this trainee/station.
    if trainee_info.status == "Pass":

        # Additional Sanity Check: Ensure there's a score linked to the trainee for the target level.
        # This prevents a scenario where the status was manually set to 'Pass' without any scores.
        # ojt_exists = OJTScore.objects.filter(

        ojt_exists_for_station_level = OJTScore.objects.filter(
            # Filter by the TraineeInfo instance, which is already scoped by station in the fetch above.
            trainee__emp_id=employee.emp_id,
            topic__level=level
        ).exists()
        # ojt_pass = ojt_exists

        # OJT is passed only if the trainee's status is "Pass" AND scores actually exist for this level.
        ojt_pass = ojt_exists_for_station_level
        if verbose:
            # print(f"[SkillMatrix] OJT status=Pass, OJTScore exists for this level: {ojt_exists}")
            print(f"[SkillMatrix] OJT status is {trainee_info.status}. OJTScore exists for THIS trainee/level: {ojt_exists_for_station_level}")
    else:
        if verbose:
            print(f"[SkillMatrix] OJT not passed → Trainee status is {trainee_info.status}")

    if verbose:
        print(f"[SkillMatrix] Final OJT passed = {ojt_pass}")

    # -------------------------
    # Check if Evaluation is passed
    # -------------------------
    eval_pass = Score.objects.filter(
        employee=employee,
        skill=station,
        level=level,
        passed=True
    ).exists()
    if verbose:
        print(f"[SkillMatrix] Evaluation passed = {eval_pass}")

    # -------------------------
    # Update or create SkillMatrix
    # -------------------------
    if ojt_pass and eval_pass:
        hierarchy = HierarchyStructure.objects.filter(station=station).first()
        if not hierarchy:
            if verbose:
                print(f"[SkillMatrix][ERROR] No HierarchyStructure found for Station: {station.station_name}")
                print("=" * 80)
            return

        obj, created = SkillMatrix.objects.update_or_create(
            employee=employee,
            # level=level,
            hierarchy=hierarchy,
            defaults={
                "employee_name": trainee_info.trainee_name,
                "emp_id": trainee_info.emp_id,
                "doj": trainee_info.doj,
                # "hierarchy": hierarchy,
                "level":level,

            }
        )
        if verbose:
            if created:
                print(f"[SkillMatrix] ✅ SkillMatrix created for Employee: {employee.emp_id}")
            else:
                print(f"[SkillMatrix] 🔄 SkillMatrix updated for Employee: {employee.emp_id}")
    else:
        if verbose:
            print(f"[SkillMatrix] ❌ Not updating. Conditions → OJT: {ojt_pass}, Eval: {eval_pass}")

    if verbose:
        print("=" * 80)


# -------------------------
# Signal for OJTScore
# -------------------------
# @receiver(post_save, sender=OJTScore)
# def update_skill_on_ojt_save(sender, instance, **kwargs):
#     print(f"[Signal][OJTScore] Saved → Trainee {instance.trainee.emp_id}, Score={instance.score}, Topic={instance.topic}")
#     try:
#         employee = MasterTable.objects.get(emp_id=instance.trainee.emp_id)
#         station = Station.objects.get(station_name=instance.trainee.station)
#     except MasterTable.DoesNotExist:
#         print(f"[Signal][ERROR] MasterTable not found for emp_id: {instance.trainee.emp_id}")
#         return
#     except Station.DoesNotExist:
#         print(f"[Signal][ERROR] Station not found: {instance.trainee.station}")
#         return

#     # ⏳ Delay 5 seconds before running the update
#     run_after_delay(update_skill_matrix, 5, employee, station, instance.topic.level, True)
@receiver(post_save, sender=OJTScore)
def update_skill_on_ojt_save(sender, instance, **kwargs):
    print(f"[Signal][OJTScore] Saved → Trainee {instance.trainee.emp_id}, Score={instance.score}, Topic={instance.topic}")
    try:
        employee = MasterTable.objects.get(emp_id=instance.trainee.emp_id)
        if not instance.trainee.station:
            print(f"[Signal][ERROR] No station for trainee {instance.trainee.emp_id}")
            return
            
        # --- CHANGE THIS ---
        # Instead of getting the ID, get the whole object.
        station_object = instance.trainee.station 
        
    except MasterTable.DoesNotExist:
        print(f"[Signal][ERROR] MasterTable not found for emp_id: {instance.trainee.emp_id}")
        return
    except Exception as e:
        print(f"[Signal][ERROR] Station access failed: {e}")
        return

    # --- AND CHANGE THIS ---
    # Pass the full station_object to the function.
    run_after_delay(update_skill_matrix, 5, employee, station_object, instance.topic.level, True)


# -------------------------
# Signal for Score
# -------------------------
@receiver(post_save, sender=Score)
def update_skill_on_eval_save(sender, instance, **kwargs):
    print(f"[Signal][Score] Saved → Employee {instance.employee.emp_id}, Skill={instance.skill}, Level={instance.level}, Passed={instance.passed}")
    if not instance.skill or not instance.level:
        print(f"[Signal][ERROR] Score missing skill or level → {instance}")
        return

    # ⏳ Delay 5 seconds before running the update
    run_after_delay(update_skill_matrix, 5, instance.employee, instance.skill, instance.level, True)

"""




# Django signals for automatic notification generation
# Handles real-time notification triggers for various system events
# """


from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Notification, MasterTable, Score, User
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

def create_notification(
    title, message, notification_type, recipient=None, recipient_email=None, 
    employee=None, priority='medium', metadata=None
):
    try:
        logger.info(f"Creating notification: {title} for {recipient.email if recipient else recipient_email}")
        notification = Notification.objects.create(
            title=title,
            message=message,
            notification_type=notification_type,
            recipient=recipient,
            recipient_email=recipient_email or (recipient.email if recipient else None),
            employee=employee,
            priority=priority,
            metadata=metadata or {},
            is_sent=False
        )
        return notification
    except Exception as e:
        logger.error(f"Error creating notification: {str(e)}")
        return None

def get_admin_users():
    try:
        admin_users = User.objects.filter(role__name__in=['admin', 'management'])
        logger.info(f"Found {admin_users.count()} admin/management users")
        if not admin_users.exists():
            logger.warning("No admin users found, falling back to first 5 users")
            return User.objects.all()[:5]
        return admin_users
    except Exception as e:
        logger.error(f"Error fetching admin users: {str(e)}")
        return User.objects.none()

def get_employee_user(employee):
    try:
        user = User.objects.get(email=employee.email)
        logger.info(f"Found user by email: {user.email} for employee {employee.emp_id}")
        return user
    except User.DoesNotExist:
        try:
            user = User.objects.get(employeeid=employee.emp_id)
            logger.info(f"Found user by employeeid: {user.email} for employee {employee.emp_id}")
            return user
        except User.DoesNotExist:
            logger.warning(f"No user found for employee {employee.emp_id}")
            return None
    except Exception as e:
        logger.error(f"Error finding user for employee {employee.emp_id}: {str(e)}")
        return None

@receiver(post_save, sender=MasterTable)
def notify_employee_registration(sender, instance, created, **kwargs):
    logger.info(f"Signal triggered for MasterTable, emp_id={instance.emp_id}, created={created}")
    if created:
        try:
            admin_users = get_admin_users()
            full_name = f"{instance.first_name} {instance.last_name or ''}".strip()
            department_name = instance.department.department_name if instance.department else "Not Assigned"
            
            for admin in admin_users:
                logger.info(f"Notifying admin: {admin.email}")
                create_notification(
                    title="New Employee Registered",
                    message=f"New employee {full_name} (ID: {instance.emp_id}) has been registered in the system.",
                    notification_type='employee_registration',
                    recipient=admin,
                    employee=instance,
                    priority='medium',
                    metadata={
                        'emp_id': instance.emp_id,
                        'email': instance.email,
                        'phone': instance.phone,
                        'department': department_name,
                        'date_of_joining': instance.date_of_joining.isoformat() if instance.date_of_joining else None,
                        'sex': instance.get_sex_display() if instance.sex else None,
                        'auto_generated': True
                    }
                )

            user = get_employee_user(instance)
            if user:
                logger.info(f"Notifying employee: {user.email}")
                create_notification(
                    title="Welcome to the System",
                    message=f"Welcome, {full_name}! Your employee profile (ID: {instance.emp_id}) has been created.",
                    notification_type='employee_registration',
                    recipient=user,
                    employee=instance,
                    priority='low',
                    metadata={
                        'emp_id': instance.emp_id,
                        'department': department_name,
                        'auto_generated': True
                    }
                )
        except Exception as e:
            logger.error(f"Error creating employee registration notification: {str(e)}")

@receiver(post_save, sender=Score)
def notify_test_assigned_and_completed(sender, instance, created, **kwargs):
    logger.info(f"Signal triggered for Score, employee={instance.employee.emp_id}, created={created}")
    try:
        admin_users = get_admin_users()
        test_name = instance.test.test_name if instance.test else "Test"
        full_name = f"{instance.employee.first_name} {instance.employee.last_name or ''}".strip()
        
        if created:
            for admin in admin_users:
                logger.info(f"Notifying admin: {admin.email}")
                create_notification(
                    title="Test Assigned",
                    message=f"Test '{test_name}' has been assigned to {full_name}.",
                    notification_type='test_assigned',
                    recipient=admin,
                    employee=instance.employee,
                    priority='medium',
                    metadata={
                        'test_name': test_name,
                        'test_id': instance.test.key_id if instance.test else None,
                        'emp_id': instance.employee.emp_id,
                        'level': str(instance.level) if instance.level else None,
                        'skill': str(instance.skill) if instance.skill else None,
                        'auto_generated': True
                    }
                )
        else:
            if instance.passed is not None:
                status = "Passed" if instance.passed else "Failed"
                priority = 'high' if not instance.passed else 'medium'
                
                for admin in admin_users:
                    logger.info(f"Notifying admin: {admin.email}")
                    create_notification(
                        title="Evaluation Completed",
                        message=f"{full_name} completed evaluation with {instance.percentage}% ({status}).",
                        notification_type='evaluation_completed',
                        recipient=admin,
                        employee=instance.employee,
                        priority=priority,
                        metadata={
                            'test_id': instance.test.key_id if instance.test else None,
                            'emp_id': instance.employee.emp_id,
                            'marks': instance.marks,
                            'percentage': str(instance.percentage),
                            'passed': instance.passed,
                            'auto_generated': True
                        }
                    )

                user = get_employee_user(instance.employee)
                if user:
                    logger.info(f"Notifying employee: {user.email}")
                    create_notification(
                        title="Your Evaluation Results",
                        message=f"You scored {instance.percentage}% ({status}).",
                        notification_type='evaluation_completed',
                        recipient=user,
                        employee=instance.employee,
                        priority=priority,
                        metadata={
                            'test_id': instance.test.key_id if instance.test else None,
                            'marks': instance.marks,
                            'percentage': str(instance.percentage),
                            'passed': instance.passed,
                            'auto_generated': True
                        }
                    )
    except Exception as e:
        logger.error(f"Error creating test notification: {str(e)}")



# import threading
# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from .models import Score, SkillMatrix, HierarchyStructure


# # ----------------------------------------
# # Helper: Run function after a delay
# # ----------------------------------------
# def run_after_delay(func, delay, *args, **kwargs):
#     """Run a function after N seconds without blocking request"""
#     timer = threading.Timer(delay, func, args=args, kwargs=kwargs)
#     timer.start()


# # ----------------------------------------
# # Core logic: create/update SkillMatrix
# # ----------------------------------------
# def process_score_for_skillmatrix(score):
#     """
#     ✅ Create/Update SkillMatrix if:
#       - skill = General
#       - level = Level 1
#     """
#     if not score.skill or not score.level:
#         return

#     if score.skill.station_name != "General":
#         return

#     if score.level.level_name != "Level 1":
#         return

#     employee = score.employee

#     try:
#         # ✅ Find hierarchy for this station
#         hierarchy = HierarchyStructure.objects.filter(station=score.skill).first()
#         if not hierarchy:
#             print(f"[SkillMatrix][ERROR] No hierarchy found for station={score.skill}")
#             return

#         # ✅ Create or update SkillMatrix
#         obj, created = SkillMatrix.objects.update_or_create(
#             employee=employee,
#             hierarchy=hierarchy,
#             level=score.level,
#             defaults={
#                 "employee_name": employee.emp_name,   # adjust if field name differs
#                 "emp_id": employee.emp_id,
#                 "doj": employee.doj,
#             },
#         )

#         if created:
#             print(f"[SkillMatrix] ✅ Created for {employee.emp_id} ({employee.emp_name}) at {hierarchy.station}")
#         else:
#             print(f"[SkillMatrix] 🔄 Updated for {employee.emp_id} ({employee.emp_name}) at {hierarchy.station}")

#     except Exception as e:
#         print(f"[SkillMatrix][ERROR] Failed for Score ID={score.id}: {e}")


# # ----------------------------------------
# # Signal: when Score is saved
# # ----------------------------------------
# @receiver(post_save, sender=Score)
# def create_skill_matrix_from_score(sender, instance, **kwargs):
#     print(f"[Signal][Score] Saved → Employee {instance.employee.emp_id}, "
#           f"Skill={instance.skill}, Level={instance.level}")

#     # ✅ Run with 5s delay
#     run_after_delay(process_score_for_skillmatrix, 5, instance)


from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import SkillMatrix, MachineAllocation

@receiver(post_save, sender=SkillMatrix)
def update_allocation_status_on_level_change(sender, instance, created, **kwargs):
    """
    Signal to update allocation status when an employee's level changes
    """
    if not created:  # Only for updates, not new creations
        # Get all pending allocations for this employee
        pending_allocations = MachineAllocation.objects.filter(
            employee=instance,
            approval_status='pending'
        )
        
        for allocation in pending_allocations:
            try:
                employee_level_value = instance.level.level_id
                machine_level_value = allocation.machine.level
                
                # Check if employee now meets the machine level requirement
                if employee_level_value >= machine_level_value:
                    allocation.approval_status = 'approved'
                    allocation.save()
                    print(f"Auto-approved allocation: {allocation}")
                    
            except (ValueError, AttributeError) as e:
                print(f"Error updating allocation {allocation.id}: {e}")
                continue



# import threading
# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from .models import Score, SkillMatrix, HierarchyStructure


# # ----------------------------------------
# # Helper: Run function after a delay
# # ----------------------------------------
# def run_after_delay(func, delay, *args, **kwargs):
#     """Run a function after N seconds without blocking request"""
#     timer = threading.Timer(delay, func, args=args, kwargs=kwargs)
#     timer.start()


# # ----------------------------------------
# # Core logic: create/update SkillMatrix
# # ----------------------------------------
# def process_score_for_skillmatrix(score):
#     """
#     ✅ Create/Update SkillMatrix if:
#       - skill = General
#       - level = Level 1
#     """
#     if not score.skill or not score.level:
#         return

#     if score.skill.station_name != "General":
#         return

#     if score.level.level_name != "Level 1":
#         return

#     employee = score.employee

#     try:
#         # ✅ Find hierarchy for this station
#         hierarchy = HierarchyStructure.objects.filter(station=score.skill).first()
#         if not hierarchy:
#             print(f"[SkillMatrix][ERROR] No hierarchy found for station={score.skill}")
#             return

#         # ✅ Create or update SkillMatrix
#         obj, created = SkillMatrix.objects.update_or_create(
#             employee=employee,
#             hierarchy=hierarchy,
#             level=score.level,
#             defaults={
#                 "employee_name": employee.first_name,   # adjust if field name differs
#                 "emp_id": employee.emp_id,
#                 "doj": employee.date_of_joining,
#             },
#         )

#         if created:
#             print(f"[SkillMatrix] ✅ Created for {employee.emp_id} ({employee.first_name}) at {hierarchy.station}")
#         else:
#             print(f"[SkillMatrix] 🔄 Updated for {employee.emp_id} ({employee.first_name}) at {hierarchy.station}")

#     except Exception as e:
#         print(f"[SkillMatrix][ERROR] Failed for Score ID={score.id}: {e}")


# # ----------------------------------------
# # Signal: when Score is saved
# # ----------------------------------------
# @receiver(post_save, sender=Score)
# def create_skill_matrix_from_score(sender, instance, **kwargs):
#     print(f"[Signal][Score] Saved → Employee {instance.employee.emp_id}, "
#           f"Skill={instance.skill}, Level={instance.level}")

#     # ✅ Run with 5s delay
#     run_after_delay(process_score_for_skillmatrix, 5, instance)





from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import SkillMatrix, MultiSkilling

@receiver(post_save, sender=SkillMatrix)
def mark_multiskilling_completed(sender, instance, **kwargs):
    """
    Whenever a SkillMatrix entry is saved, check if there is a scheduled MultiSkilling
    for the same employee + station + skill_level, and mark it as completed.
    """
    employee = instance.employee
    station = getattr(instance.hierarchy, "station", None)
    level = instance.level  

    if not station or not level:
        return  

    MultiSkilling.objects.filter(
        employee=employee,
        station=station,
        skill_level=level
    ).exclude(status="completed").update(status="completed")




# Level 1 Check for skill matrix update 

import threading
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import (
    Score, ProductivityEvaluation, QualityEvaluation,
    SkillMatrix, HierarchyStructure, Level
)


# -----------------------------
# Helper: Run function later
# -----------------------------
def run_after_delay(func, delay, *args, **kwargs):
    """Run a function after N seconds without blocking request"""
    timer = threading.Timer(delay, func, args=args, kwargs=kwargs)
    timer.start()


# -----------------------------
# Core logic for Level 1
# -----------------------------
def process_level1_update(employee):
    """
    ✅ Create/Update SkillMatrix Level 1 if:
       - Evaluation (Score) = PASS for Level 1 + General
       - ProductivityEvaluation = PASS
       - QualityEvaluation = PASS
    """
    try:
        # 1. Check Score (evaluation)
        score_pass = Score.objects.filter(
            employee=employee,
            level__level_name="Level 1",
            skill__station_name="General",
            passed=True
        ).exists()
        if not score_pass:
            print(f"[SkillMatrix][WAIT] Score not passed yet for {employee.emp_id}")
            return

        # 2. Check Productivity
        prod_pass = ProductivityEvaluation.objects.filter(
            employee=employee, status="PASS"
        ).exists()
        if not prod_pass:
            print(f"[SkillMatrix][WAIT] Productivity not passed yet for {employee.emp_id}")
            return

        # 3. Check Quality
        qual_pass = QualityEvaluation.objects.filter(
            employee=employee, status="PASS"
        ).exists()
        if not qual_pass:
            print(f"[SkillMatrix][WAIT] Quality not passed yet for {employee.emp_id}")
            return

        # All three conditions met → update SkillMatrix
        hierarchy = HierarchyStructure.objects.filter(
            station__station_name="General"
        ).first()
        if not hierarchy:
            print(f"[SkillMatrix][ERROR] No hierarchy found for General station")
            return

        level = Level.objects.get(level_name="Level 1")

        obj, created = SkillMatrix.objects.update_or_create(
            employee=employee,
            hierarchy=hierarchy,
            defaults={
                "employee_name": f"{employee.first_name} {employee.last_name}",
                "emp_id": employee.emp_id,
                "doj": employee.date_of_joining,
                "level": level,
            }
        )

        if created:
            print(f"[SkillMatrix] ✅ Created Level 1 for {employee.emp_id}")
        else:
            print(f"[SkillMatrix] 🔄 Updated Level 1 for {employee.emp_id}")

    except Exception as e:
        print(f"[SkillMatrix][ERROR] Failed Level 1 update for {employee.emp_id}: {e}")


# -----------------------------
# Signals for each model
# -----------------------------
@receiver(post_save, sender=Score)
def check_level1_from_score(sender, instance, **kwargs):
    if instance.level and instance.level.level_name == "Level 1" and \
       instance.skill and instance.skill.station_name == "General":
        run_after_delay(process_level1_update, 3, instance.employee)


@receiver(post_save, sender=ProductivityEvaluation)
def check_level1_from_productivity(sender, instance, **kwargs):
    if instance.status == "PASS":
        run_after_delay(process_level1_update, 3, instance.employee)


@receiver(post_save, sender=QualityEvaluation)
def check_level1_from_quality(sender, instance, **kwargs):
    if instance.status == "PASS":
        run_after_delay(process_level1_update, 3, instance.employee)















# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from .models import EvaluationLevel2, TraineeInfo, OperatorObservanceSheet, SkillMatrix, HierarchyStructure

# @receiver(post_save, sender=EvaluationLevel2)
# def update_skill_matrix_on_evaluation_save(sender, instance, created, **kwargs):
#     """
#     Signal to update SkillMatrix when EvaluationLevel2 is saved with status 'Pass' or 'Re-evaluation Pass',
#     and both TraineeInfo and OperatorObservanceSheet are also passed for the same employee, station, and level.
#     """
#     # Only proceed if the evaluation status is 'Pass' or 'Re-evaluation Pass'
#     if instance.status not in [EvaluationLevel2.STATUS_PASS, EvaluationLevel2.STATUS_RE_EVAL_PASS]:
#         return

#     employee = instance.employee
#     station_name = instance.station_name
#     level = instance.level
#     verbose = True  # For logging/debugging; set to False in production

#     if verbose:
#         print("=" * 80)
#         print(f"[SkillMatrix Signal] Checking update for Employee: {employee.emp_id}, "
#               f"Station: {station_name}, Level: {level.level_name if level else '❌ None'}")

#     # Step 1: Check TraineeInfo (OJT) status
#     try:
#         trainee_info = TraineeInfo.objects.filter(
#             emp_id=employee.emp_id,
#             station__station_name=station_name
#         ).first()
#     except TraineeInfo.DoesNotExist:
#         trainee_info = None

#     if not trainee_info:
#         if verbose:
#             print(f"[SkillMatrix Signal][ERROR] No TraineeInfo found for Employee: {employee.emp_id} "
#                   f"at Station: {station_name}")
#             print("=" * 80)
#         return

#     ojt_pass = trainee_info.status == "Pass"
#     if verbose:
#         print(f"[SkillMatrix Signal] Found TraineeInfo → Name: {trainee_info.trainee_name}, "
#               f"Status: {trainee_info.status}, DOJ: {trainee_info.doj}")
#         print(f"[SkillMatrix Signal] OJT passed = {ojt_pass}")

#     # Step 2: Check OperatorObservanceSheet status
#     try:
#         observance_sheet = OperatorObservanceSheet.objects.filter(
#             operator_name=f"{employee.first_name} {employee.last_name}",
#             process_name=station_name,
#             level=level.level_name,  # Assuming level.level_name matches OperatorObservanceSheet.level
#             result="Pass"  # Assuming 'result' field indicates pass/fail
#         ).first()
#     except OperatorObservanceSheet.DoesNotExist:
#         observance_sheet = None

#     if not observance_sheet:
#         if verbose:
#             print(f"[SkillMatrix Signal][ERROR] No OperatorObservanceSheet found for Employee: {employee.emp_id} "
#                   f"at Station: {station_name}, Level: {level.level_name}")
#             print("=" * 80)
#         return

#     observance_pass = observance_sheet.result == "Qualified"
#     if verbose:
#         print(f"[SkillMatrix Signal] Found OperatorObservanceSheet → Operator: {observance_sheet.operator_name}, "
#               f"Result: {observance_sheet.result}")
#         print(f"[SkillMatrix Signal] Observance Sheet passed = {observance_pass}")

#     # Step 3: Check EvaluationLevel2 status (already confirmed by signal condition)
#     eval_pass = instance.status in [EvaluationLevel2.STATUS_PASS, EvaluationLevel2.STATUS_RE_EVAL_PASS]
#     if verbose:
#         print(f"[SkillMatrix Signal] Evaluation passed = {eval_pass}")

#     # Step 4: Update or create SkillMatrix if all three conditions are met
#     if ojt_pass and eval_pass and observance_pass:
#         # Get HierarchyStructure for the station
#         hierarchy = HierarchyStructure.objects.filter(station__station_name=station_name).first()
#         if not hierarchy:
#             if verbose:
#                 print(f"[SkillMatrix Signal][ERROR] No HierarchyStructure found for Station: {station_name}")
#                 print("=" * 80)
#             return

#         obj, created = SkillMatrix.objects.update_or_create(
#             employee=employee,
#             hierarchy=hierarchy,
#             level=level,
#             defaults={
#                 "employee_name": f"{employee.first_name} {employee.last_name}",
#                 "emp_id": employee.emp_id,
#                 "doj": trainee_info.doj,  # Using DOJ from TraineeInfo as it's likely the most reliable source
#             }
#         )
#         if verbose:
#             if created:
#                 print(f"[SkillMatrix Signal] ✅ SkillMatrix created for Employee: {employee.emp_id}")
#             else:
#                 print(f"[SkillMatrix Signal] 🔄 SkillMatrix updated for Employee: {employee.emp_id}")
#     else:
#         if verbose:
#             print(f"[SkillMatrix Signal] ❌ Not updating. Conditions → OJT: {ojt_pass}, "
#                   f"Eval: {eval_pass}, Observance: {observance_pass}")
#             print("=" * 80)




# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from .models import EvaluationLevel2, TraineeInfo, SkillMatrix, HierarchyStructure

# @receiver(post_save, sender=EvaluationLevel2)
# def update_skill_matrix_on_evaluation_save(sender, instance, created, **kwargs):
#     """
#     Signal to update SkillMatrix when EvaluationLevel2 is saved with status 'Pass' or 'Re-evaluation Pass',
#     and TraineeInfo is passed for the same employee, station, and level.
#     """
#     if instance.status not in [EvaluationLevel2.STATUS_PASS, EvaluationLevel2.STATUS_RE_EVAL_PASS]:
#         return

#     employee = instance.employee
#     station_name = instance.station_name.replace("+", " ")  # Normalize: Replace '+' with space
#     level = instance.level
#     level_name = level.level_name  # e.g., "Level 2"
#     verbose = True

#     if verbose:
#         print("=" * 80)
#         print(f"[SkillMatrix Signal] Checking update for Employee: {employee.emp_id}, "
#               f"Station: {station_name}, Level: {level_name}")

#     # Step 1: Check TraineeInfo (OJT) status
#     try:
#         trainee_info = TraineeInfo.objects.filter(
#             emp_id=employee.emp_id,
#             station__station_name=station_name
#         ).first()
#     except TraineeInfo.DoesNotExist:
#         trainee_info = None

#     if not trainee_info:
#         if verbose:
#             print(f"[SkillMatrix Signal][ERROR] No TraineeInfo found for Employee: {employee.emp_id} "
#                   f"at Station: {station_name}")
#             print("=" * 80)
#         return

#     ojt_pass = trainee_info.status == "Pass"
#     if verbose:
#         print(f"[SkillMatrix Signal] Found TraineeInfo → Name: {trainee_info.trainee_name}, "
#               f"Status: {trainee_info.status}, DOJ: {trainee_info.doj}")
#         print(f"[SkillMatrix Signal] OJT passed = {ojt_pass}")

#     # Step 2: Check EvaluationLevel2 status
#     eval_pass = instance.status in [EvaluationLevel2.STATUS_PASS, EvaluationLevel2.STATUS_RE_EVAL_PASS]
#     if verbose:
#         print(f"[SkillMatrix Signal] Evaluation passed = {eval_pass}")

#     # Step 3: Update or create SkillMatrix if both conditions are met
#     if ojt_pass and eval_pass:
#         hierarchy = HierarchyStructure.objects.filter(station__station_name=station_name).first()
#         if not hierarchy:
#             if verbose:
#                 print(f"[SkillMatrix Signal][ERROR] No HierarchyStructure found for Station: {station_name}")
#                 print("=" * 80)
#             return

#         obj, created = SkillMatrix.objects.update_or_create(
#             employee=employee,
#             hierarchy=hierarchy,
#             level=level,
#             defaults={
#                 "employee_name": f"{employee.first_name} {employee.last_name}",
#                 "emp_id": employee.emp_id,
#                 "doj": trainee_info.doj,
#             }
#         )
#         if verbose:
#             if created:
#                 print(f"[SkillMatrix Signal] ✅ SkillMatrix created for Employee: {employee.emp_id}")
#             else:
#                 print(f"[SkillMatrix Signal] 🔄 SkillMatrix updated for Employee: {employee.emp_id}")
#     else:
#         if verbose:
#             print(f"[SkillMatrix Signal] ❌ Not updating. Conditions → OJT: {ojt_pass}, Eval: {eval_pass}")
#             print("=" * 80)


from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import EvaluationLevel2, TraineeInfo, SkillMatrix, HierarchyStructure, OperatorObservanceSheet

@receiver(post_save, sender=EvaluationLevel2)
def update_skill_matrix_on_evaluation_save(sender, instance, created, **kwargs):
    """
    Signal to update SkillMatrix when EvaluationLevel2 is saved with status 'Pass' or 'Re-evaluation Pass',
    TraineeInfo is passed, and OperatorObservanceSheet has result 'Qualified' for the same employee, station, and level.
    """
    if instance.status not in [EvaluationLevel2.STATUS_PASS, EvaluationLevel2.STATUS_RE_EVAL_PASS]:
        return

    employee = instance.employee
    station_name = instance.station_name.replace("+", " ")  # Normalize: Replace '+' with space
    level = instance.level
    level_name = level.level_name  # e.g., "Level 2"
    verbose = True

    if verbose:
        print("=" * 80)
        print(f"[SkillMatrix Signal] Checking update for Employee: {employee.emp_id}, "
              f"Station: {station_name}, Level: {level_name}")

    # Step 1: Check TraineeInfo (OJT) status
    try:
        trainee_info = TraineeInfo.objects.filter(
            emp_id=employee.emp_id,
            station__station_name=station_name
        ).first()
    except TraineeInfo.DoesNotExist:
        trainee_info = None

    if not trainee_info:
        if verbose:
            print(f"[SkillMatrix Signal][ERROR] No TraineeInfo found for Employee: {employee.emp_id} "
                  f"at Station: {station_name}")
            print("=" * 80)
        return

    ojt_pass = trainee_info.status == "Pass"
    if verbose:
        print(f"[SkillMatrix Signal] Found TraineeInfo → Name: {trainee_info.trainee_name}, "
              f"Status: {trainee_info.status}, DOJ: {trainee_info.doj}")
        print(f"[SkillMatrix Signal] OJT passed = {ojt_pass}")

    # Step 2: Check EvaluationLevel2 status
    eval_pass = instance.status in [EvaluationLevel2.STATUS_PASS, EvaluationLevel2.STATUS_RE_EVAL_PASS]
    if verbose:
        print(f"[SkillMatrix Signal] Evaluation passed = {eval_pass}")

    # Step 3: Check OperatorObservanceSheet status
    try:
        observance_sheet = OperatorObservanceSheet.objects.filter(
            operator_name=f"{employee.first_name} {employee.last_name}",
            process_name=station_name,
            level=level_name
        ).last()
    except OperatorObservanceSheet.DoesNotExist:
        observance_sheet = None

    if not observance_sheet:
        if verbose:
            print(f"[SkillMatrix Signal][ERROR] No OperatorObservanceSheet found for Employee: {employee.emp_id} "
                  f"at Station: {station_name}, Level: {level_name}")
            print("=" * 80)
        return

    observance_pass = observance_sheet.result == "Qualified"
    if verbose:
        print(f"[SkillMatrix Signal] Found OperatorObservanceSheet → Operator: {observance_sheet.operator_name}, "
              f"Result: {observance_sheet.result}")
        print(f"[SkillMatrix Signal] Observance passed = {observance_pass}")

    # Step 4: Update or create SkillMatrix if all conditions are met
    if ojt_pass and eval_pass and observance_pass:
        hierarchy = HierarchyStructure.objects.filter(station__station_name=station_name).first()
        if not hierarchy:
            if verbose:
                print(f"[SkillMatrix Signal][ERROR] No HierarchyStructure found for Station: {station_name}")
                print("=" * 80)
            return

        obj, created = SkillMatrix.objects.update_or_create(
            employee=employee,
            hierarchy=hierarchy,
            level=level,
            defaults={
                "employee_name": f"{employee.first_name} {employee.last_name}",
                "emp_id": employee.emp_id,
                "doj": trainee_info.doj,
            }
        )
        if verbose:
            if created:
                print(f"[SkillMatrix Signal] ✅ SkillMatrix created for Employee: {employee.emp_id}")
            else:
                print(f"[SkillMatrix Signal] 🔄 SkillMatrix updated for Employee: {employee.emp_id}")
    else:
        if verbose:
            print(f"[SkillMatrix Signal] ❌ Not updating. Conditions → OJT: {ojt_pass}, Eval: {eval_pass}, "
                  f"Observance: {observance_pass}")
            print("=" * 80)