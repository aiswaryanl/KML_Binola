from django.core.mail import send_mail
from django.conf import settings

def send_milestone_email(subject, message, recipient_list):
    """
    Sends a plain text email to multiple recipients.
    """
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=recipient_list,
        fail_silently=False,
    )














# # utils.py

# from .models import LevelTwoTraineeInfo, Score, OperatorSkill,EmployeeMaster
# from django.db import transaction

# def check_and_update_operator_skill(trainee_id):
#     try:
#         # Get the trainee info
#         trainee = LevelTwoTraineeInfo.objects.get(traineeId=trainee_id)

#         # 🛠 Match based on pay_code instead of emp_id
#         employee = EmployeeMaster.objects.get(pay_code=trainee_id)

#         # Calculate and update training status
#         training_status = trainee.calculate_and_save_training_status()

#         # Check for the latest score
#         latest_score = Score.objects.filter(employee=employee).order_by('-created_at').first()

#         if training_status == "Pass" and latest_score and latest_score.passed:
#             station = latest_score.skill
#             level = latest_score.level

#             if not station or not level:
#                 print("Station or level not provided in score.")
#                 return False

#             with transaction.atomic():
#                 skill_obj, created = OperatorSkill.objects.update_or_create(
#                     operator=employee,
#                     station=station,
#                     defaults={'skill_level': level}
#                 )
#                 print(f"OperatorSkill {'created' if created else 'updated'} for {employee.name}")
#                 return True

#         else:
#             print("Training or test not passed.")
#             return False

#     except LevelTwoTraineeInfo.DoesNotExist:
#         print(f"Trainee with ID {trainee_id} does not exist.")
#         return False

#     except EmployeeMaster.DoesNotExist:
#         print(f"Employee with pay_code {trainee_id} does not exist.")
#         return False

#     except Exception as e:
#         print(f"Error: {str(e)}")
#         return False







# from .models import LevelThreeTraineeInfo, Score, OperatorSkill, EmployeeMaster
# from django.db import transaction

# def check_and_update_operator_skill_level_three(trainee_id):
#     try:
#         # Get trainee
#         trainee = LevelThreeTraineeInfo.objects.get(trainee_Id=trainee_id)

#         # Get employee based on pay_code = trainee_id
#         employee = EmployeeMaster.objects.get(pay_code=trainee_id)

#         # Recalculate training status
#         training_status = trainee.calculate_and_save_training_status()

#         # Get latest test score for this employee
#         latest_score = Score.objects.filter(employee=employee).order_by('-created_at').first()

#         if training_status == "Pass" and latest_score and latest_score.passed:
#             station = latest_score.skill
#             level = latest_score.level

#             if not station or not level:
#                 print("Missing station or level in latest score.")
#                 return False

#             with transaction.atomic():
                
#                 skill_obj, created = OperatorSkill.objects.update_or_create(
#                     operator=employee,
#                     station=station,
#                     defaults={'skill_level': level}
#                 )
#                 print(f"OperatorSkill {'created' if created else 'updated'} for {employee.name}")
#                 return True

#         else:
#             print("Either training or test not passed.")
#             return False

#     except LevelThreeTraineeInfo.DoesNotExist:
#         print(f"No Level 3 trainee found for ID {trainee_id}")
#         return False

#     except EmployeeMaster.DoesNotExist:
#         print(f"No Employee found with pay_code {trainee_id}")
#         return False

#     except Exception as e:
#         print(f"Error during Level 3 skill update: {str(e)}")
#         return False

# utils.py

from django.core.mail import send_mail
from django.conf import settings
from .models import (
    OperatorPerformanceEvaluation, OJTLevel2Quantity, 
    MasterTable, Score, Station, StationSetting, 
    TenCyclePassingCriteria, QuantityPassingCriteria,
    Level, Department
)
from django.db import transaction
from django.db.models import Max

def send_milestone_email(subject, message, recipient_list):
    """
    Sends a plain text email to multiple recipients.
    """
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=recipient_list,
        fail_silently=False,
    )

def check_and_update_operator_skill_ten_cycle(emp_id):
    """
    Check 10-cycle evaluation status and update operator skill level.
    Uses OperatorPerformanceEvaluation model.
    """
    try:
        # Get the employee from MasterTable
        employee = MasterTable.objects.get(emp_id=emp_id)
        
        # Get the latest 10-cycle evaluation for this employee
        latest_evaluation = OperatorPerformanceEvaluation.objects.filter(
            employee=employee
        ).order_by('-created_at').first()

        if not latest_evaluation:
            print(f"No 10-cycle evaluation found for employee {emp_id}")
            return False

        # Check if evaluation is completed and passed
        if latest_evaluation.is_completed and latest_evaluation.final_status == 'Pass':
            station = latest_evaluation.station
            level = latest_evaluation.level

            if not station or not level:
                print("Station or level not provided in evaluation.")
                return False

            # Get latest score for this employee and station
            latest_score = Score.objects.filter(
                employee=employee,
                skill=station
            ).order_by('-created_at').first()

            # Check if test was also passed
            if latest_score and latest_score.passed:
                with transaction.atomic():
                    # Create or update skill level
                    # Note: You'll need to create an OperatorSkill model if it doesn't exist
                    # For now, we'll assume you want to track this in the Score model
                    skill_obj, created = Score.objects.update_or_create(
                        employee=employee,
                        skill=station,
                        level=level,
                        defaults={
                            'marks': latest_score.marks,
                            'percentage': latest_score.percentage,
                            'passed': True
                        }
                    )
                    print(f"Skill level {'created' if created else 'updated'} for {employee} - {station} - {level}")
                    return True
            else:
                print("Test not passed or no score found.")
                return False
        else:
            print("10-cycle evaluation not completed or not passed.")
            return False

    except MasterTable.DoesNotExist:
        print(f"Employee with emp_id {emp_id} does not exist.")
        return False
    except Exception as e:
        print(f"Error in ten-cycle skill update: {str(e)}")
        return False

def check_and_update_operator_skill_ojt_quantity(trainee_id):
    """
    Check OJT Quantity evaluation status and update operator skill level.
    Uses OJTLevel2Quantity model.
    """
    try:
        # Get the OJT record
        ojt_record = OJTLevel2Quantity.objects.get(trainee_id=trainee_id)
        
        # Get the employee from MasterTable using emp_id
        if ojt_record.emp_id:
            employee = MasterTable.objects.get(emp_id=ojt_record.emp_id)
        else:
            print(f"No emp_id found for trainee {trainee_id}")
            return False

        # Evaluate the OJT status
        ojt_record.evaluate_status()

        # Check if OJT is passed
        if ojt_record.status == "Pass":
            # Get station from station_name (you might need to map this)
            station = Station.objects.filter(station_name=ojt_record.station_name).first()
            level = ojt_record.level

            if not station or not level:
                print("Station or level not provided in OJT record.")
                return False

            # Get latest score for this employee and station
            latest_score = Score.objects.filter(
                employee=employee,
                skill=station
            ).order_by('-created_at').first()

            # Check if test was also passed
            if latest_score and latest_score.passed:
                with transaction.atomic():
                    # Create or update skill level
                    skill_obj, created = Score.objects.update_or_create(
                        employee=employee,
                        skill=station,
                        level=level,
                        defaults={
                            'marks': latest_score.marks,
                            'percentage': latest_score.percentage,
                            'passed': True
                        }
                    )
                    print(f"OJT Quantity skill level {'created' if created else 'updated'} for {employee} - {station} - {level}")
                    return True
            else:
                print("Test not passed or no score found.")
                return False
        else:
            print("OJT Quantity evaluation not passed.")
            return False

    except OJTLevel2Quantity.DoesNotExist:
        print(f"OJT record with trainee_id {trainee_id} does not exist.")
        return False
    except MasterTable.DoesNotExist:
        print(f"Employee with emp_id {ojt_record.emp_id} does not exist.")
        return False
    except Exception as e:
        print(f"Error in OJT quantity skill update: {str(e)}")
        return False

def check_and_update_operator_skill_general(emp_id, evaluation_type='ten_cycle'):
    """
    Generic function to check and update operator skill based on evaluation type.
    """
    if evaluation_type == 'ten_cycle':
        return check_and_update_operator_skill_ten_cycle(emp_id)
    elif evaluation_type == 'ojt_quantity':
        return check_and_update_operator_skill_ojt_quantity(emp_id)
    else:
        print(f"Unsupported evaluation type: {evaluation_type}")
        return False

def create_skill_level_record(employee, station, level, marks, percentage, passed=True):
    """
    Helper function to create or update skill level record.
    """
    try:
        with transaction.atomic():
            skill_obj, created = Score.objects.update_or_create(
                employee=employee,
                skill=station,
                level=level,
                defaults={
                    'marks': marks,
                    'percentage': percentage,
                    'passed': passed
                }
            )
            print(f"Skill record {'created' if created else 'updated'} for {employee} - {station} - {level}")
            return True
    except Exception as e:
        print(f"Error creating skill record: {str(e)}")
        return False

# Additional utility functions for skill management

def get_operator_current_skill_level(employee, station):
    """
    Get the current skill level for an operator at a specific station.
    """
    try:
        latest_score = Score.objects.filter(
            employee=employee,
            skill=station,
            passed=True
        ).select_related('level').order_by('-created_at').first()
        
        if latest_score:
            return {
                'level': latest_score.level,
                'percentage': latest_score.percentage,
                'marks': latest_score.marks,
                'date': latest_score.created_at
            }
        return None
    except Exception as e:
        print(f"Error getting current skill level: {str(e)}")
        return None

def get_passing_criteria_for_evaluation(employee, station, level, evaluation_type):
    """
    Get passing criteria for a specific evaluation type.
    """
    try:
        department = station.subline.line.department
        
        if evaluation_type == 'ten_cycle':
            criteria = TenCyclePassingCriteria.objects.filter(
                level=level,
                department=department,
                station=station
            ).first()
            return criteria.passing_percentage if criteria else 60.0
            
        elif evaluation_type == 'ojt_quantity':
            criteria = QuantityPassingCriteria.objects.filter(
                level=level,
                department=department
            ).first()
            if criteria:
                return {
                    'production': criteria.production_passing_percentage,
                    'rejection': criteria.rejection_passing_percentage
                }
            return None
            
        return None
    except Exception as e:
        print(f"Error getting passing criteria: {str(e)}")
        return None

def send_skill_level_notification(employee, station, level, action='updated'):
    """
    Send notification when skill level is updated.
    """
    try:
        from .models import Notification, User
        
        # Get user associated with employee (you might need to adjust this logic)
        user = User.objects.filter(employeeid=employee.emp_id).first()
        
        notification = Notification.objects.create(
            title=f"Skill Level {action.capitalize()}",
            message=f"Your skill level has been {action} to {level.level_name} for station {station.station_name}",
            notification_type='milestone_reached',
            recipient=user,
            employee=employee,
            level=level,
            priority='high'
        )
        
        # Send email if user exists
        if user:
            send_milestone_email(
                subject=f"Skill Level Updated: {level.level_name}",
                message=f"Dear {employee.first_name},\n\nYour skill level has been {action} to {level.level_name} for station {station.station_name}.\n\nBest regards,\nTraining System",
                recipient_list=[user.email]
            )
        
        return True
    except Exception as e:
        print(f"Error sending skill notification: {str(e)}")
        return False