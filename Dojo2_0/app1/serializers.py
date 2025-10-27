
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import DailyProductionData, HumanBodyCheckSession, HumanBodyCheckSheet, HumanBodyQuestions, Level2QuantityOJTEvaluation, LevelColour, MasterTable, OJTLevel2Quantity, User, UserRegistration
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from .models import Hq, Factory, Department, Line, SubLine, Station
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser



# serializers.py
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import User, Role

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=100)
    password = serializers.CharField(max_length=128, write_only=True)

    def validate(self, attrs):
        email = attrs.get('email', '').strip()
        password = attrs.get('password', '')

        if not email or not password:
            raise ValidationError({'error': _('Email and password are required.')})

        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if user is None:
            raise ValidationError({'error': _('Invalid email or password.')})

        if not user.is_active:
            raise ValidationError({'error': _('This account is inactive. Please contact support.')})

        # IMPORTANT: only store JSON-serializable primitives in validated_data
        attrs['user_id'] = user.pk
        attrs['email'] = user.email
        # store role name instead of Role model instance
        attrs['role_name'] = getattr(user.role, 'name', None)
        return attrs



class LogoutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()

    def validate_refresh_token(self, value):
        if not value:
            raise serializers.ValidationError("Refresh token is required for logout.")
        return value

from rest_framework import serializers
from .models import Role, User

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

from rest_framework import serializers
from .models import Role, User
from rest_framework.exceptions import ValidationError

class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate_role(self, value):
        # Check if the role exists and is active
        try:
            role = Role.objects.get(name=value, is_active=True)
        except Role.DoesNotExist:
            raise ValidationError(f"Role '{value}' does not exist or is not active.")
        return value

    def create(self, validated_data):
        role_name = validated_data.pop('role')
        # Fetch the existing role (no get_or_create)
        role = Role.objects.get(name=role_name, is_active=True)
        password = validated_data.pop('password')
        user = User.objects.create_user(
            role=role,
            **validated_data,
            password=password
        )
        return user

    class Meta:
        model = User
        fields = ['email', 'employeeid', 'first_name', 'last_name', 'role', 'password', 'hq', 'factory', 'department']




from rest_framework import serializers
from .models import Level, Days, SubTopic, SubTopicContent, TrainingContent, Evaluation

# Level 0
class UserRegistrationSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    phoneNumber = serializers.CharField(source='phone_number')
    tempId = serializers.CharField(source='temp_id', read_only=True)
    aadharNumber = serializers.CharField(source='aadhar_number', required=False, allow_null=True, allow_blank=True)
    hasExperience = serializers.BooleanField(source='experience', default=False)
    experienceYears = serializers.IntegerField(source='experience_years', required=False, allow_null=True)
    companyOfExperience = serializers.CharField(source='company_of_experience', required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = UserRegistration
        fields = [
            'id', 'firstName', 'lastName', 'tempId', 'email', 'phoneNumber', 'sex',
            'created_at', 'updated_at', 'is_active', 'photo','aadharNumber', 'employment_type', 'hasExperience',
            'experienceYears', 'companyOfExperience'
        ]
        extra_kwargs = {
            'email': {'required': False, 'allow_null': True},
            'id': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'is_active': {'read_only': True},
        }

    def create(self, validated_data):
        if 'email' in validated_data and validated_data['email'] == '':
            validated_data['email'] = None
        if 'aadhar_number' in validated_data and validated_data['aadhar_number'] == '':
            validated_data['aadhar_number'] = None
        if 'employment_type' in validated_data and validated_data['employment_type'] == '':
            validated_data['employment_type'] = None
        if 'company_of_experience' in validated_data and validated_data['company_of_experience'] == '':
            validated_data['company_of_experience'] = None        
        return UserRegistration.objects.create(**validated_data)
    
    def validate(self, data):
        """
        Validate that experience fields are provided when has_experience is True
        """
        experience = data.get('experience', False)
        experience_years = data.get('experience_years')
        company_of_experience = data.get('company_of_experience')

        if experience:
            if not experience_years:
                raise serializers.ValidationError({
                    'experienceYears': 'Experience years is required when experience is selected.'
                })
            if not company_of_experience:
                raise serializers.ValidationError({
                    'companyOfExperience': 'Company of experience is required when experience is selected.'
                })

        # Validate Aadhar number format if provided
        aadhar_number = data.get('aadhar_number')
        if aadhar_number and len(aadhar_number) != 12:
            raise serializers.ValidationError({
                'aadharNumber': 'Aadhar number must be exactly 12 digits.'
            })

        return data   
class UserUpdateSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    phoneNumber = serializers.CharField(source='phone_number')
    tempId = serializers.CharField(source='temp_id')  
    aadharNumber = serializers.CharField(source='aadhar_number', required=False, allow_null=True, allow_blank=True)
    hasExperience = serializers.BooleanField(source='experience', required=False)
    experienceYears = serializers.IntegerField(source='experience_years', required=False, allow_null=True)
    companyOfExperience = serializers.CharField(source='company_of_experience', required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = UserRegistration
        fields = [
            'id', 'firstName', 'lastName', 'tempId', 'email', 'phoneNumber', 'sex',
            'created_at', 'updated_at', 'is_active', 'photo',
            'aadharNumber', 'employment_type', 'hasExperience',
            'experienceYears', 'companyOfExperience'
        ]
        extra_kwargs = {
            'email': {'required': False, 'allow_null': True},
            'department': {'required': False, 'allow_null': True, 'allow_blank': True},
            'phoneNumber': {'required': False},
            'id': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
            'is_active': {'read_only': True},
        }

    def validate(self, data):
        """
        Validate that experience fields are provided when experience is True
        """
        experience = data.get('experience', self.instance.experience if self.instance else False)
        experience_years = data.get('experience_years', self.instance.experience_years if self.instance else None)
        company_of_experience = data.get('company_of_experience', self.instance.company_of_experience if self.instance else None)

        if experience:
            if not experience_years:
                raise serializers.ValidationError({
                    'experienceYears': 'Experience years is required when experience is selected.'
                })
            if not company_of_experience:
                raise serializers.ValidationError({
                    'companyOfExperience': 'Company of experience is required when experience is selected.'
                })

        # Validate Aadhar number format if provided
        aadhar_number = data.get('aadhar_number')
        if aadhar_number and len(aadhar_number) != 12:
            raise serializers.ValidationError({
                'aadharNumber': 'Aadhar number must be exactly 12 digits.'
            })

        return data


# Level 0

class HumanBodyQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HumanBodyQuestions
        fields = '__all__'


class HumanBodyCheckSheetSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    
    class Meta:
        model = HumanBodyCheckSheet
        fields = ['id', 'question', 'question_text', 'answer']


class HumanBodyCheckSessionSerializer(serializers.ModelSerializer):
    sheet_answers = HumanBodyCheckSheetSerializer(many=True, read_only=True)
    overall_status = serializers.ReadOnlyField()

    class Meta:
        model = HumanBodyCheckSession
        fields = ['id', 'temp_id', 'created_at', 'sheet_answers', 'overall_status']
        



class UserWithBodyCheckSerializer(serializers.ModelSerializer):
    body_checks = serializers.SerializerMethodField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone_number = serializers.CharField()
    aadharNumber = serializers.CharField(source='aadhar_number', required=False, allow_null=True, allow_blank=True)
    hasExperience = serializers.BooleanField(source='experience', default=False)
    experienceYears = serializers.IntegerField(source='experience_years', required=False, allow_null=True)
    companyOfExperience = serializers.CharField(source='company_of_experience', required=False, allow_null=True, allow_blank=True)
    
    
    class Meta:
        model = UserRegistration
        fields = [
            'first_name', 'last_name', 'temp_id', 'email', 'phone_number', 
            'sex', 'created_at', 'is_active', 'photo','aadharNumber', 'employment_type', 'hasExperience',
            'experienceYears', 'companyOfExperience', 'body_checks','is_added_to_master', 'added_to_master_at'
        ]

    def get_body_checks(self, obj):
       
        latest_session = HumanBodyCheckSession.objects.filter(user=obj).order_by('-created_at').first()
        if not latest_session:
            latest_session = HumanBodyCheckSession.objects.filter(temp_id=obj.temp_id).order_by('-created_at').first()
        
        if not latest_session:
            return []
        
        return [{
            'id': latest_session.id,
            'temp_id': obj.temp_id,
            'check_date': latest_session.created_at,
            'overall_status': latest_session.overall_status,
        }]


# ------------------ TrainingContent Serializer ------------------
from rest_framework import serializers
from .models import Level, Days, SubTopic, SubTopicContent, TrainingContent, Evaluation

class TrainingContentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="trainingcontent_id", read_only=True)
    training_file = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = TrainingContent
        fields = [
            "id",
            "trainingcontent_id",
            "subtopiccontent",
            "description",
            "training_file",
            "url_link",
        ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.training_file:
            request = self.context.get("request")
            url = instance.training_file.url
            rep["training_file"] = request.build_absolute_uri(url) if request else url
        else:
            rep["training_file"] = None
        return rep

    def validate(self, attrs):
        if self.instance is None and not (attrs.get("training_file") or attrs.get("url_link")):
            raise serializers.ValidationError("Provide either training_file or url_link.")
        return attrs

class SubTopicContentSerializer(serializers.ModelSerializer):
    training_contents = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SubTopicContent
        fields = ["subtopiccontent_id", "subtopic", "content", "training_contents"]

    def get_training_contents(self, obj):
        request = self.context.get("request")
        return TrainingContentSerializer(obj.training_contents.all(), many=True, context={"request": request}).data

class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = ["evaluation_id", "evaluation_text"]

class SubTopicSerializer(serializers.ModelSerializer):
    contents = SubTopicContentSerializer(many=True)
    evaluations = EvaluationSerializer(many=True)
    days_id = serializers.IntegerField(write_only=True)  # Accept days_id in JSON
    level_id = serializers.IntegerField(write_only=True)  # Accept level_id in JSON
     
    class Meta:
        model = SubTopic
        fields = ["subtopic_id", "subtopic_name", "days_id", "level_id", "contents", "evaluations"]
     
    def create(self, validated_data):
        contents_data = validated_data.pop("contents", [])
        evaluations_data = validated_data.pop("evaluations", [])
        days_id = validated_data.pop("days_id")
        level_id = validated_data.pop("level_id")
                 
        # Get the Days and Level objects
        days_obj = Days.objects.get(days_id=days_id)
        level_obj = Level.objects.get(level_id=level_id)
        subtopic = SubTopic.objects.create(days=days_obj, level=level_obj, **validated_data)
         
        for content_data in contents_data:
            training_contents_data = content_data.pop("training_contents", [])
            subtopic_content = SubTopicContent.objects.create(subtopic=subtopic, **content_data)
            for tc_data in training_contents_data:
                TrainingContent.objects.create(subtopiccontent=subtopic_content, **tc_data)
         
        for eval_data in evaluations_data:
            Evaluation.objects.create(subtopic=subtopic, **eval_data)
         
        return subtopic

class SubTopicListSerializer(serializers.ModelSerializer):
    """Read-only serializer for listing subtopics with related info"""
    id = serializers.IntegerField(source='subtopic_id', read_only=True)
    title = serializers.CharField(source='subtopic_name', read_only=True)
    day = serializers.IntegerField(source='days.days_id', read_only=True)
    day_name = serializers.CharField(source='days.day', read_only=True)
    level_name = serializers.CharField(source='level.level_name', read_only=True)
    
    class Meta:
        model = SubTopic
        fields = ["id", "title", "day", "day_name", "level_name"]

class SubTopicAdminSerializer(serializers.ModelSerializer):
    """Write serializer for admin operations"""
    subtopic_id = serializers.IntegerField(read_only=True)
    days = serializers.PrimaryKeyRelatedField(queryset=Days.objects.all())
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())

    class Meta:
        model = SubTopic
        fields = ["subtopic_id", "subtopic_name", "days", "level"]

class DaysSerializer(serializers.ModelSerializer):
    subtopics = SubTopicListSerializer(many=True, read_only=True)
    
    class Meta:
        model = Days
        fields = ["days_id", "day", "subtopics"]

class DaysWriteSerializer(serializers.ModelSerializer):
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all(), write_only=True)
    days_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Days
        fields = ["days_id", "day", "level"]

class LevelSerializer(serializers.ModelSerializer):
    days = DaysSerializer(many=True, read_only=True)
    subtopics = SubTopicListSerializer(many=True, read_only=True)

    class Meta:
        model = Level
        fields = ["level_id", "level_name", "days", "subtopics"]

    def create(self, validated_data):
        days_data = validated_data.pop("days", [])
        subtopics_data = validated_data.pop("subtopics", [])

        # Create Level
        level = Level.objects.create(**validated_data)

        # Create Days first
        created_days = []
        for day_data in days_data:
            day_obj = Days.objects.create(level=level, **day_data)
            created_days.append(day_obj)

        # Create SubTopics directly under level
        for st_data in subtopics_data:
            contents_data = st_data.pop("contents", [])
            evaluations_data = st_data.pop("evaluations", [])
            days_id = st_data.pop("days_id", None)

            # Find the days object from created_days
            days_obj = None
            if days_id:
                days_obj = next((d for d in created_days if d.days_id == days_id), None)
            if not days_obj and created_days:
                days_obj = created_days[0]  # Fallback to first day

            subtopic = SubTopic.objects.create(level=level, days=days_obj, **st_data)

            # SubTopicContents
            for content_data in contents_data:
                training_contents_data = content_data.pop("training_contents", [])
                subtopic_content = SubTopicContent.objects.create(subtopic=subtopic, **content_data)
                for tc_data in training_contents_data:
                    TrainingContent.objects.create(subtopiccontent=subtopic_content, **tc_data)

            # Evaluations
            for eval_data in evaluations_data:
                Evaluation.objects.create(subtopic=subtopic, **eval_data)

        return level



# ------------------ Master Table Serializer ------------------
class MasterTableSerializer(serializers.ModelSerializer):
    # Read-only field to show department name in GET responses
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    
    class Meta:
        model = MasterTable
        fields = [
            'emp_id',
            'first_name',
            'last_name',
            'department',        # Use the department ID for POST/PUT
            'department_name',   # Show name in GET
            'date_of_joining',
            'birth_date',
            'sex',
            'email',
            'phone'
        ]



from rest_framework import serializers
from .models import ProductionPlan

class ProductionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionPlan
        fields = '__all__'


from rest_framework import serializers
from .models import QuestionPaper

class QuestionPaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionPaper
        fields = "__all__"



from rest_framework import serializers
from .models import  StationLevelQuestionPaper


class StationLevelQuestionPaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = StationLevelQuestionPaper
        fields = "__all__"


from rest_framework import serializers
from .models import TemplateQuestion


class TemplateQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateQuestion
        fields = "__all__"

    def validate(self, data):
        correct_answer = data.get("correct_answer")
        options = [
            data.get("option_a"),
            data.get("option_b"),
            data.get("option_c"),
            data.get("option_d"),
        ]
        if correct_answer not in options:
            raise serializers.ValidationError(
                {"correct_answer": "Correct answer must match one of the options."}
            )
        return data
    


#serializers.py

from rest_framework import serializers
from .models import Hq, Factory, Department, Line, SubLine, Station

class HqSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hq
        fields = ['hq_id', 'hq_name']

class FactorySerializer(serializers.ModelSerializer):
    hq_name = serializers.CharField(source='hq.hq_name', read_only=True)
    
    class Meta:
        model = Factory
        fields = ['factory_id', 'factory_name', 'hq', 'hq_name']

class DepartmentSerializer(serializers.ModelSerializer):
    factory_name = serializers.CharField(source='factory.factory_name', read_only=True)
    hq_name = serializers.CharField(source='hq.hq_name', read_only=True)
    
    class Meta:
        model = Department
        fields = ['department_id', 'department_name', 'factory', 'factory_name', 'hq', 'hq_name']

class LineSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    factory_name = serializers.CharField(source='factory.factory_name', read_only=True)
    hq_name = serializers.CharField(source='hq.hq_name', read_only=True)
    
    class Meta:
        model = Line
        fields = ['line_id', 'line_name', 'department', 'department_name', 'factory', 'factory_name', 'hq', 'hq_name']

class SubLineSerializer(serializers.ModelSerializer):
    line_name = serializers.CharField(source='line.line_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    factory_name = serializers.CharField(source='factory.factory_name', read_only=True)
    hq_name = serializers.CharField(source='hq.hq_name', read_only=True)
    
    class Meta:
        model = SubLine
        fields = ['subline_id', 'subline_name', 'line', 'line_name', 'department', 'department_name', 'factory', 'factory_name', 'hq', 'hq_name']

class StationSerializer(serializers.ModelSerializer):
    subline_name = serializers.CharField(source='subline.subline_name', read_only=True)
    line_name = serializers.CharField(source='line.line_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    factory_name = serializers.CharField(source='factory.factory_name', read_only=True)
    hq_name = serializers.CharField(source='hq.hq_name', read_only=True)
    
    class Meta:
        model = Station
        fields = ['station_id', 'station_name', 'subline', 'subline_name', 'line', 'line_name', 'department', 'department_name', 'factory', 'factory_name', 'hq', 'hq_name']



from rest_framework import serializers
from .models import HierarchyStructure

from rest_framework import serializers
from .models import HierarchyStructure

class HierarchyStructureSerializer(serializers.ModelSerializer):
    hq_name = serializers.CharField(source='hq.hq_name', read_only=True)
    factory_name = serializers.CharField(source='factory.factory_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    line_name = serializers.CharField(source='line.line_name', read_only=True)
    subline_name = serializers.CharField(source='subline.subline_name', read_only=True)
    station_name = serializers.CharField(source='station.station_name', read_only=True)

    class Meta:
        model = HierarchyStructure
        fields = [
            'structure_id', 
            'structure_name', 
            'hq', 'hq_name',
            'factory', 'factory_name',
            'department', 'department_name',
            'line', 'line_name',
            'subline', 'subline_name',
            'station', 'station_name',
        ]

    
    def validate_structure_data(self, value):
        """Validate that structure_data is a valid JSON object"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("structure_data must be a JSON object")
        return value
    
    def create(self, validated_data):
        """Create a new HierarchyStructure instance"""
        try:
            return super().create(validated_data)
        except Exception as e:
            raise serializers.ValidationError({
                'error': 'Failed to create hierarchy structure',
                'details': str(e)
            })
    
    def update(self, instance, validated_data):
        """Update an existing HierarchyStructure instance"""
        try:
            return super().update(instance, validated_data)
        except Exception as e:
            raise serializers.ValidationError({
                'error': 'Failed to update hierarchy structure',
                'details': str(e)
            })
        

#---------------------AR/VR------------------------
from rest_framework import serializers
from .models import ARVRTrainingContent

class ARVRTrainingContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ARVRTrainingContent
        fields='__all__'

# --------------------------
# Level 2 Process Dojo
# --------------------------


from rest_framework import serializers
from .models import LevelWiseTrainingContent

class LevelWiseTrainingContentSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source="level.name", read_only=True)
    station_name = serializers.CharField(source="station.station_name", read_only=True)

    class Meta:
        model = LevelWiseTrainingContent
        fields = [
            "id",
            "level",
            "level_name",
            "station",
            "station_name",
            "content_name",
            "file",
            "url",
            "updated_at",
        ]



# ===================== Hanchou & Shokuchou ====================#

from rest_framework import serializers
from .models import HanchouExamQuestion

class HanchouExamQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HanchouExamQuestion
        fields = '__all__'

from rest_framework import serializers
from django.utils import timezone
from .models import HanchouExamResult, MasterTable
# IMPORTANT: adjust this import to where your EmployeeSerializer actually lives
# from .serializers import EmployeeSerializer  # or from .employee_serializers import EmployeeSerializer
from .serializers import MasterTableSerializer 

class HanchouExamResultSerializer(serializers.ModelSerializer):
    """
    Handles serialization for Hanchou Exam Results.
    - Expects `employee_id`, `started_at`, `submitted_at`, `total_questions`, and `score` from the client.
    - Calculates `duration_seconds` automatically.
    - The model's `save` method handles calculating `passed`.
    - Returns the full result object, including nested employee details, on read.
    """

    # --- Fields for Reading Data (Output) ---
    # Use your EmployeeSerializer to show nested employee details when retrieving results.
    # employee = EmployeeSerializer(read_only=True)
    employee = MasterTableSerializer(read_only=True)
    # A custom read-only field to show the calculated percentage.
    percentage = serializers.FloatField(read_only=True)


    # --- Field for Writing Data (Input) ---
    # This field accepts the primary key (the ID) of an employee from the frontend.
    # `source='employee'` tells DRF to use this ID to populate the 'employee' model field.
    employee_id = serializers.PrimaryKeyRelatedField(
        queryset=MasterTable.objects.all(),
        source='employee',
        write_only=True
    )

    class Meta:
        model = HanchouExamResult
        # List ALL fields that should be part of the API representation.
        # We removed 'attempt_id' and 'exam_date' as they are not in your model.
        fields = [
            'id',
            'employee',           # For reading (nested object)
            'employee_id',        # For writing (just the ID)
            'exam_name',
            'started_at',
            'submitted_at',
            'total_questions',
            'score',
            'duration_seconds',
            'pass_mark_percent',
            'passed',
            'percentage',
            'remarks'
        ]
        # Fields that are calculated or set by the server and should not be accepted from the client.
        read_only_fields = (
            'id', 
            'exam_name', 
            'duration_seconds', 
            'passed', 
            'percentage'
        )

    def validate(self, attrs):
        """
        Perform cross-field validation.
        """
        # Ensure submitted_at is not earlier than started_at.
        if attrs.get('started_at') and attrs.get('submitted_at'):
            if attrs['submitted_at'] < attrs['started_at']:
                raise serializers.ValidationError({"submitted_at": "Submission time cannot be earlier than start time."})

        # Ensure score is not greater than total_questions.
        if attrs.get('score') is not None and attrs.get('total_questions') is not None:
            if attrs['score'] > attrs['total_questions']:
                raise serializers.ValidationError({"score": "Score cannot be greater than total questions."})

        return attrs

    def create(self, validated_data):
        """
        Override the create method to add custom logic.
        """
        started_at = validated_data.get('started_at')
        submitted_at = validated_data.get('submitted_at')

        # Automatically calculate the duration if timestamps are provided.
        if started_at and submitted_at:
            duration = submitted_at - started_at
            validated_data['duration_seconds'] = int(duration.total_seconds())

        # Create the HanchouExamResult instance using the validated data.
        # The model's save() method will handle setting the `passed` field.
        return HanchouExamResult.objects.create(**validated_data)


from rest_framework import serializers
from .models import ShokuchouExamQuestion, ShokuchouExamResult, MasterTable
# IMPORTANT: adjust import path to wherever EmployeeSerializer is defined
# from .serializers import EmployeeSerializer  
from .serializers import MasterTableSerializer  


# --- SHO QUESTION SERIALIZER ---
class ShokuchouExamQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShokuchouExamQuestion
        fields = '__all__'


# --- SHO RESULT SERIALIZER ---
class ShokuchouExamResultSerializer(serializers.ModelSerializer):
    """
    Handles serialization for Shokuchou Exam Results.
    - Expects `employee_id`, `sho_started_at`, `sho_submitted_at`, `sho_total_questions`, and `sho_score` from the client.
    - Calculates `sho_duration_seconds` automatically.
    - The model's `save` method handles calculating `sho_passed`.
    - Returns the full result object, including nested employee details, on read.
    """

    # --- Output fields ---
    # employee = EmployeeSerializer(read_only=True)
    employee = MasterTableSerializer(read_only=True)
    sho_percentage = serializers.FloatField(read_only=True)

    # --- Input field ---
    employee_id = serializers.PrimaryKeyRelatedField(
        queryset=MasterTable.objects.all(),
        source='employee',
        write_only=True
    )

    class Meta:
        model = ShokuchouExamResult
        fields = [
            'id',
            'employee',             # read
            'employee_id',          # write
            'sho_exam_name',
            'sho_started_at',
            'sho_submitted_at',
            'sho_total_questions',
            'sho_score',
            'sho_duration_seconds',
            'sho_pass_mark_percent',
            'sho_passed',
            'sho_percentage',
            'sho_remarks'
        ]
        read_only_fields = (
            'id',
            'sho_exam_name',
            'sho_duration_seconds',
            'sho_passed',
            'sho_percentage'
        )

    def validate(self, attrs):
        """
        Cross-field validation for Shokuchou Exam.
        """
        if attrs.get('sho_started_at') and attrs.get('sho_submitted_at'):
            if attrs['sho_submitted_at'] < attrs['sho_started_at']:
                raise serializers.ValidationError(
                    {"sho_submitted_at": "Submission time cannot be earlier than start time."}
                )

        if attrs.get('sho_score') is not None and attrs.get('sho_total_questions') is not None:
            if attrs['sho_score'] > attrs['sho_total_questions']:
                raise serializers.ValidationError(
                    {"sho_score": "Score cannot be greater than total questions."}
                )

        return attrs

    def create(self, validated_data):
        """
        Automatically calculate sho_duration_seconds before saving.
        """
        started_at = validated_data.get('sho_started_at')
        submitted_at = validated_data.get('sho_submitted_at')

        if started_at and submitted_at:
            duration = submitted_at - started_at
            validated_data['sho_duration_seconds'] = int(duration.total_seconds())

        return ShokuchouExamResult.objects.create(**validated_data)


# your_app/serializers.py
class CardShokuchouExamResultSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for Shokuchou results, formatted for the Employee Card view.
    """
    exam_name = serializers.CharField(source='sho_exam_name')
    score = serializers.IntegerField(source='sho_score')
    total_questions = serializers.IntegerField(source='sho_total_questions')
    percentage = serializers.FloatField(source='sho_percentage')
    passed = serializers.BooleanField(source='sho_passed')
    submitted_at = serializers.DateTimeField(source='sho_submitted_at')

    class Meta:
        model = ShokuchouExamResult
        fields = (
            'id',
            'exam_name',
            'score',
            'total_questions',
            'percentage',
            'passed',
            'submitted_at',
        )



# yourapp/serializers.py

# ... other imports ...
from .models import HanchouExamResult # Make sure to import the model

# ... other serializers ...

# ★★★ NEW SERIALIZER FOR THE EMPLOYEE HISTORY CARD ★★★
class CardHanchouExamResultSerializer(serializers.ModelSerializer):
    """
    A read-only serializer to format Hanchou exam results for the employee card view.
    It provides a clean, flat structure.
    """
    # The 'percentage' field is a @property on the model, so we declare it here
    # to ensure it's included in the serialization.
    percentage = serializers.FloatField(read_only=True)

    class Meta:
        model = HanchouExamResult
        # List the specific fields you want to show in "Card 6" of your React component.
        fields = [
            'id',
            'exam_name',
            'score',
            'total_questions',
            'percentage',
            'passed',
            'submitted_at',
        ]


from .models import HanContent,ShoContent,ShoTrainingContent,ShoSubtopic
from .models import HanTrainingContent

# your_app/serializers.py

from rest_framework import serializers
from .models import HanContent, HanSubtopic, HanTrainingContent

from django.urls import reverse # <-- IMPORT reverse


# --- THIS IS THE CORRECTED HAN SERIALIZER ---
class HanTrainingContentSerializer(serializers.ModelSerializer):
    # This field accepts the file during an upload (POST/PUT).
    # It won't be included in the response (GET).
    training_file = serializers.FileField(write_only=True, required=False)

    # This field is what your React frontend will receive.
    # It's read-only because it's generated by the method below.
    training_file_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = HanTrainingContent
        # FIX #1: Added 'training_file_url' to this list.
        fields = [
            'id',
            'description',
            'training_file',       # For uploads
            'training_file_url',   # For downloads
            'url_link',
            'han_subtopic'
        ]
        # This part is correct, it hides the subtopic object from the response.
        extra_kwargs = {'han_subtopic': {'write_only': True}}

    # FIX #2: Renamed this method from get_training_file to get_training_file_url
    # The name MUST match the field it's for: get_<field_name>
    def get_training_file_url(self, obj):
        """
        This method is called by DRF to populate the 'training_file_url' field.
        """
        if obj.training_file and hasattr(obj.training_file, 'url'):
            request = self.context.get('request')
            # This part is correct, it looks up your named URL
            serve_url = reverse('serve-han-material-file', kwargs={'pk': obj.pk})
            # This part is correct, it builds the full URL
            return request.build_absolute_uri(serve_url)
        return None



# --- MODIFIED SUBTOPIC SERIALIZER ---
class HanSubtopicSerializer(serializers.ModelSerializer):
    materials = HanTrainingContentSerializer(many=True, read_only=True)

    class Meta:
        model = HanSubtopic
        # We must include 'han_content' so it can be sent in a POST request.
        fields = ['id', 'title', 'materials', 'han_content']
        extra_kwargs = {'han_content': {'write_only': True}}



#  Main Topic Serializers ---

class HanContentDetailSerializer(serializers.ModelSerializer):
    """
    Serializes a SINGLE Main Topic with its full nested structure of subtopics and materials.
    This is used for the "detail" view (e.g., GET /api/han-content/1/).
    """
    # The 'subtopics' field matches the `related_name` in the HanSubtopic model.
    subtopics = HanSubtopicSerializer(many=True, read_only=True)

    class Meta:
        model = HanContent
        fields = ['id', 'title', 'subtopics']


class HanContentListSerializer(serializers.ModelSerializer):
    """
    Serializes a Main Topic for a list view.
    It's lightweight and only includes the essential info.
    This is used for the "list" view (e.g., GET /api/han-content/).
    """
    class Meta:
        model = HanContent
        fields = ['id', 'title']





from django.urls import reverse
from rest_framework import serializers
from .models import ShoContent, ShoSubtopic, ShoTrainingContent


# --- THIS IS THE CORRECTED SHO SERIALIZER ---
class ShoTrainingContentSerializer(serializers.ModelSerializer):
    # This field accepts the file during an upload (POST/PUT).
    training_file = serializers.FileField(write_only=True, required=False)

    # This field is what your React frontend will receive.
    training_file_url = serializers.SerializerMethodField(read_only=True)

    # RENAMED for consistency with the Han serializer and the React frontend.
    # The frontend expects 'description', not 'sho_description'.
    description = serializers.CharField(source='sho_description')

    class Meta:
        model = ShoTrainingContent
        # Updated the fields list to be consistent and correct.
        fields = [
            'id',
            'description',          # Using the renamed field
            'training_file',        # For uploads
            'training_file_url',    # For downloads
            'url_link',
            'sho_subtopic'
        ]
        extra_kwargs = {'sho_subtopic': {'write_only': True}}

    # The method to generate the URL for the 'training_file_url' field.
    def get_training_file_url(self, obj):
        """
        Populates the 'training_file_url' field.
        """
        if obj.training_file and hasattr(obj.training_file, 'url'):
            request = self.context.get('request')
            # This correctly looks up the specific URL for Shokuchou files.
            serve_url = reverse('serve-sho-material-file', kwargs={'pk': obj.pk})
            return request.build_absolute_uri(serve_url)
        return None




# --- SHO SUBTOPIC SERIALIZER ---
class ShoSubtopicSerializer(serializers.ModelSerializer):
    sho_materials = ShoTrainingContentSerializer(many=True, read_only=True)

    class Meta:
        model = ShoSubtopic
        fields = ['id', 'title', 'sho_materials', 'sho_content']
        extra_kwargs = {'sho_content': {'write_only': True}}


# --- SHO CONTENT DETAIL SERIALIZER ---
class ShoContentDetailSerializer(serializers.ModelSerializer):
    # Nested subtopics with materials
    sho_subtopics = ShoSubtopicSerializer(many=True, read_only=True)

    class Meta:
        model = ShoContent
        fields = ['id', 'title', 'sho_subtopics']


# --- SHO CONTENT LIST SERIALIZER ---
class ShoContentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoContent
        fields = ['id', 'title']



#====================== hanchouend ===============================#

#=======================10 cycle starts ==========================================#
        
from rest_framework import serializers
from django.core.validators import MinValueValidator
from .models import (
    TenCycleDayConfiguration,
    TenCycleTopics,
    TenCycleSubTopic,
    TenCyclePassingCriteria,
    OperatorPerformanceEvaluation,
    EvaluationSubTopicMarks
)
from .models import Station, Department, Level, MasterTable

from app1.serializers import (
    StationSerializer,
    DepartmentSerializer,
    LevelSerializer,
    MasterTableSerializer
)

class TenCycleDayConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenCycleDayConfiguration
        fields = ['id', 'level', 'department', 'station', 'day_name', 'sequence_order', 'is_active', 'created_at']


class TenCycleSubTopicSerializer(serializers.ModelSerializer):
    topic = serializers.PrimaryKeyRelatedField(queryset=TenCycleTopics.objects.all())

    class Meta:
        model = TenCycleSubTopic
        fields = '__all__' 


class TenCycleTopicsSerializer(serializers.ModelSerializer):
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    station = serializers.PrimaryKeyRelatedField(queryset=Station.objects.all(), allow_null=True, required=False)

    class Meta:
        model = TenCycleTopics
        fields = ['id', 'level', 'department', 'station', 'slno', 'cycle_topics', 'is_active', 'created_at']


class TenCyclePassingCriteriaSerializer(serializers.ModelSerializer):
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    station = serializers.PrimaryKeyRelatedField(queryset=Station.objects.all(), allow_null=True, required=False)

    class Meta:
        model = TenCyclePassingCriteria
        fields = '__all__' 

class EvaluationSubMarksSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=OperatorPerformanceEvaluation.objects.all())
    subtopic = serializers.PrimaryKeyRelatedField(queryset=TenCycleSubTopic.objects.all())
    day = serializers.PrimaryKeyRelatedField(queryset=TenCycleDayConfiguration.objects.all())

    class Meta:
        model = EvaluationSubTopicMarks
        fields = [
            'id', 'employee', 'subtopic', 'day',
            'mark_1', 'mark_2', 'mark_3', 'mark_4', 'mark_5',
            'mark_6', 'mark_7', 'mark_8', 'mark_9', 'mark_10',
            'total_score', 'max_possible_score'
        ]
        read_only_fields = ['total_score', 'max_possible_score']

    def validate(self, data):
        # Validate marks don't exceed subtopic score_required
        subtopic = data['subtopic']
        marks = [data.get(f'mark_{i}', 0) or 0 for i in range(1, 11)]
        max_score = subtopic.score_required
        for mark in marks:
            if mark > max_score:
                raise serializers.ValidationError(f"Mark {mark} exceeds maximum allowed per question {max_score}.")
        return data

#=======================10 cycle end ==========================================#

# ====================== Machine Allocation Approval =========================== #

from rest_framework import serializers
from .models import MachineAllocation

class MachineAllocationApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = MachineAllocation
        fields = ['id', 'approval_status']



from rest_framework import serializers
from .models import MasterTable, MachineAllocation

class EmployeeWithStatusSerializer(serializers.ModelSerializer):
    approval_status = serializers.SerializerMethodField()

    class Meta:
        model = MasterTable
        fields = ['id', 'name', 'approval_status']  # include fields as needed

    def get_approval_status(self, obj):
        machine_id = self.context.get('machine_id')
        if machine_id:
            allocation = MachineAllocation.objects.filter(machine_id=machine_id, employee=obj).first()
            if allocation:
                return allocation.approval_status
        return None
    
# =========================== Machine Allocation Approval end ============================ #
#OJT serializers

# ------------------ OJT Topic ------------------

from rest_framework import serializers
from .models import OJTTopic

class OJTTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = OJTTopic
        fields =  "__all__"




# ------------------ OJT Days ------------------
from rest_framework import serializers
from .models import OJTDay

class OJTDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = OJTDay
        fields =  "__all__"





from rest_framework import serializers
from .models import OJTScoreRange

class OJTScoreRangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OJTScoreRange
        fields =  "__all__"






from rest_framework import serializers
from .models import OJTScore


class OJTScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = OJTScore
        fields =  "__all__"   # includes topic, day, trainee, score

    def validate(self, data):
        """
        Run the same validation you put in the model.clean().
        This ensures API users also get proper error responses.
        """
        instance = OJTScore(**data)  # build a temporary instance
        instance.clean()             # calls your model clean() method
        return data





from rest_framework import serializers
from .models import OJTPassingCriteria


class OJTPassingCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = OJTPassingCriteria
        fields = "__all__"







from rest_framework import serializers
from .models import TraineeInfo, OJTScore


class OJTScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = OJTScore
        fields = ["id", "topic", "day", "score"]


# class TraineeInfoSerializer(serializers.ModelSerializer):
#     scores = OJTScoreSerializer(many=True, write_only=True)
#     scores_data = OJTScoreSerializer(source="scores", many=True, read_only=True)

#     class Meta:
#         model = TraineeInfo
#         fields = [
#             "id", "trainee_name", "trainer_id", "emp_id",
#             "line", "subline", "station", "process_name",
#             "revision_date", "doj", "trainer_name", "status",
#             "scores", "scores_data"
#         ]

#     def create(self, validated_data):
#         scores_data = validated_data.pop("scores", [])
#         trainee = TraineeInfo.objects.create(**validated_data)

#         for score_data in scores_data:
#             # ✅ Create instance first, then call save() to trigger status update
#             score = OJTScore(trainee=trainee, **score_data)
#             score.save()  # This MUST call the custom save() method

#         # 🔄 Force refresh trainee from database to get updated status
#         trainee.refresh_from_db()
#         return trainee

#     def update(self, instance, validated_data):
#         scores_data = validated_data.pop("scores", [])

#         # Update trainee fields
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()

#         # Replace scores
#         instance.scores.all().delete()
#         for score_data in scores_data:
#             score = OJTScore(trainee=instance, **score_data)
#             score.save()  # This MUST call the custom save() method

#         # 🔄 Force refresh trainee from database to get updated status  
#         instance.refresh_from_db()
#         return instance
    
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import TraineeInfo, OJTScore, Station

class TraineeInfoSerializer(serializers.ModelSerializer):
    scores = OJTScoreSerializer(many=True, write_only=True)
    scores_data = OJTScoreSerializer(source="scores", many=True, read_only=True)
    station = serializers.PrimaryKeyRelatedField(queryset=Station.objects.all())  # Handles station_id
    station_name = serializers.CharField(source="station.station_name", read_only=True)  # Displays station name

    class Meta:
        model = TraineeInfo
        fields = [
            "id", "trainee_name", "trainer_id", "emp_id",
            "line", "subline", "station", "station_name",
            "process_name", "revision_date", "doj", "trainer_name", "status",
            "scores", "scores_data"
        ]

    def create(self, validated_data):
        scores_data = validated_data.pop("scores", [])
        trainee = TraineeInfo.objects.create(**validated_data)

        for score_data in scores_data:
            score = OJTScore(trainee=trainee, **score_data)
            score.save()

        trainee.refresh_from_db()
        return trainee

    def update(self, instance, validated_data):
        scores_data = validated_data.pop("scores", [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.scores.all().delete()
        for score_data in scores_data:
            score = OJTScore(trainee=instance, **score_data)
            score.save()

        instance.refresh_from_db()
        return instance

from rest_framework import serializers
from .models import QuantityOJTScoreRange, QuantityPassingCriteria
from app1.models import Department, Level  # ✅ import your related models


class QuantityOJTScoreRangeSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())

    class Meta:
        model = QuantityOJTScoreRange
        fields = [
            "id",
            "department", "level",
            "production_min_score", "production_max_score",
            "rejection_min_score", "rejection_max_score",
        ]


class QuantityPassingCriteriaSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())

    class Meta:
        model = QuantityPassingCriteria
        fields = [
            "id",
            "department", "level",
            "production_passing_percentage",
            "rejection_passing_percentage",
        ]






from rest_framework import serializers
from .models import OJTLevel2Quantity, Level2QuantityOJTEvaluation, Level


class Level2QuantityOJTEvaluationSerializer(serializers.ModelSerializer):
    percentage = serializers.ReadOnlyField()  # ✅ auto-calculated field

    class Meta:
        model = Level2QuantityOJTEvaluation
        fields = [
            "id", "day", "date", "plan", "production_actual",
            "production_marks", "rejection_marks",
            "number_of_rejections", "percentage"  # ✅ removed production_total & rejection_total
        ]


class OJTLevel2QuantitySerializer(serializers.ModelSerializer):
    evaluations = Level2QuantityOJTEvaluationSerializer(many=True, write_only=True)
    evaluations_data = Level2QuantityOJTEvaluationSerializer(source="evaluations", many=True, read_only=True)
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())

    class Meta:
        model = OJTLevel2Quantity
        fields = [
            "id", "level", "trainee_name", "trainee_id", "emp_id",
            "station_name", "line_name", "process_name",
            "revision_date", "doj", "trainer_name",
            "evaluations", "evaluations_data",
            "engineer_judge", "status"
        ]

    def create(self, validated_data):
        evaluations_data = validated_data.pop("evaluations", [])
        trainee = OJTLevel2Quantity.objects.create(**validated_data)
        for eval_data in evaluations_data:
            Level2QuantityOJTEvaluation.objects.create(ojt_record=trainee, **eval_data)
        return trainee

    def update(self, instance, validated_data):
        evaluations_data = validated_data.pop("evaluations", [])
        # update trainee fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        # replace evaluations
        instance.evaluations.all().delete()
        for eval_data in evaluations_data:
            Level2QuantityOJTEvaluation.objects.create(ojt_record=instance, **eval_data)
        return instance


    

# =================== Refreshment Training ============================= #

from rest_framework import serializers
from .models import Training_category, Curriculum, CurriculumContent, Trainer_name, Venues, Schedule, MasterTable,EmployeeAttendance,RescheduleLog

class Training_categorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Training_category
        fields = '__all__'

class CurriculumSerializer(serializers.ModelSerializer):
    category = Training_categorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Training_category.objects.all(), source='category', write_only=True)

    class Meta:
        model = Curriculum
        fields = ['id', 'category', 'category_id', 'topic', 'description']

class CurriculumContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurriculumContent
        fields = '__all__'

class Trainer_nameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer_name
        fields = '__all__'

class VenuesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venues
        fields = '__all__'

class RefresherOperatorMasterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MasterTable
        # fields = ['id', 'employee_code', 'full_name']
        fields = ['emp_id', 'first_name', 'last_name']

class ScheduleSerializer(serializers.ModelSerializer):
    training_category = Training_categorySerializer(read_only=True)
    training_category_id = serializers.PrimaryKeyRelatedField(queryset=Training_category.objects.all(), source='training_category', write_only=True)

    training_name = CurriculumSerializer(read_only=True)
    training_name_id = serializers.PrimaryKeyRelatedField(queryset=Curriculum.objects.all(), source='training_name', write_only=True)

    trainer = Trainer_nameSerializer(read_only=True)
    trainer_id = serializers.PrimaryKeyRelatedField(queryset=Trainer_name.objects.all(), source='trainer', write_only=True)

    venue = VenuesSerializer(read_only=True)
    venue_id = serializers.PrimaryKeyRelatedField(queryset=Venues.objects.all(), source='venue', write_only=True)

    employees = RefresherOperatorMasterSerializer(many=True, read_only=True)
    employee_ids = serializers.PrimaryKeyRelatedField(many=True, queryset=MasterTable.objects.all(), write_only=True, source='employees')

    class Meta:
        model = Schedule
        fields = ['id', 'training_category', 'training_category_id', 'training_name', 'training_name_id',
                  'trainer', 'trainer_id', 'venue', 'venue_id', 'status', 'date', 'time',
                  'employees','employee_ids']


class EmployeeAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeAttendance
        fields = [
            'id',
            'schedule',
            'employee',
            'status',
            'notes',
            'reschedule_date',
            'reschedule_time',
            'reschedule_reason',
            'updated_at',
        ]
        read_only_fields = ['updated_at']


class RescheduleLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RescheduleLog
        fields='__all__'

# =================== Refreshment Training End ============================= #

from rest_framework import serializers
from .models import Department, Station, StationSetting

class DepartmentselectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['department_id', 'department_name']

class StationselectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = ['station_id', 'station_name']



from rest_framework import serializers
from .models import StationSetting, Department, Station

class StationSettingSerializer(serializers.Serializer):
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source='department', write_only=True
    )
    station_id = serializers.PrimaryKeyRelatedField(
        queryset=Station.objects.all(), source='station', write_only=True
    )
    options = serializers.ListField(
        child=serializers.ChoiceField(choices=StationSetting.SETTING_CHOICES)
    )

    def create(self, validated_data):
        department = validated_data['department']
        station = validated_data['station']
        options = validated_data['options']
        created = []
        for opt in options:
            setting = StationSetting.objects.create(
                department=department,
                station=station,
                option=opt
            )
            created.append(setting)
        return created

    def validate(self, data):
        department = data['department']
        station = data['station']
        if station.subline.line.department != department:
            raise serializers.ValidationError("Station does not belong to selected department.")
        
        # Always return the validated data
        return data
    

# from rest_framework import serializers
from .models import (
    KeyEvent, ConnectEvent, VoteEvent,
    TestSession, Score, MasterTable, Level, Station  # Replaced Skill with Station
)


class KeyEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyEvent
        fields = "__all__"


class ConnectEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectEvent
        fields = "__all__"


class VoteEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoteEvent
        fields = "__all__"


class TestSessionSerializer(serializers.ModelSerializer):
    department = serializers.CharField(source="department.department_name", read_only=True, default="")
    employee_name = serializers.SerializerMethodField()
    level_name = serializers.CharField(source="level.level_name", read_only=True)
    skill_name = serializers.CharField(source="skill.station_name", read_only=True, default="")  # Updated to skill.station_name

    class Meta:
        model = TestSession
        fields = [
            "id", "key_id", "employee", "employee_name","department",
            "level", "level_name", "skill", "skill_name"
        ]

    def get_employee_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"


# class ScoreSerializer(serializers.ModelSerializer):
#     # employee_id = serializers.IntegerField(source="employee.emp_id", read_only=True)
#     employee_id = serializers.CharField(source="employee.emp_id", read_only=True)
#     department = serializers.CharField(source="department.department_name", read_only=True, default="")
#     name = serializers.SerializerMethodField()
#     section = serializers.CharField(source="employee.section", default="", read_only=True)  # Check if section exists
#     total_questions = serializers.SerializerMethodField()
#     test_name = serializers.CharField(source="test.key_id", read_only=True)

#     class Meta:
#         model = Score
#         fields = [
#             "employee_id", "name", "section","department",
#             "marks", "percentage", "total_questions",
#             "passed", "test_name", "created_at"
#         ]

#     def get_name(self, obj):
#         return f"{obj.employee.first_name} {obj.employee.last_name}"

#     def get_total_questions(self, obj):
#         # Updated to use question_paper from TestSession
#         if obj.test and obj.test.question_paper:
#             return obj.test.question_paper.questions.count()
#         return 0
class ScoreSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(source="employee.emp_id", read_only=True)
    name = serializers.SerializerMethodField()
    section = serializers.CharField(source="employee.section", default="", read_only=True)
    department = serializers.SerializerMethodField()
    level_name = serializers.CharField(source="level.level_name", read_only=True, default="")
    skill = serializers.CharField(source="skill.station_name", read_only=True, default="")
    total_questions = serializers.SerializerMethodField()
    test_name = serializers.CharField(source="test.key_id", read_only=True)

    class Meta:
        model = Score
        fields = [
            "employee_id", "name", "section", "department",
            "marks", "percentage", "total_questions",
            "passed", "test_name", "created_at", "level_name", "skill"
        ]

    def get_name(self, obj):
        return f"{obj.employee.first_name} {obj.employee.last_name}"

    def get_department(self, obj):
        print(f"Score.department: {obj.department}")
        print(f"Employee.department: {obj.employee.department if obj.employee else None}")
        print(f"Test.department: {obj.test.department if obj.test else None}")
        if obj.department:
            return obj.department.department_name
        elif obj.employee and obj.employee.department:
            return obj.employee.department.department_name
        elif obj.test and obj.test.department:
            return obj.test.department.department_name
        return "N/A"

    def get_total_questions(self, obj):
        if obj.test and obj.test.question_paper:
            return obj.test.question_paper.template_questions.count()
        return 0

class SimpleScoreSerializer(serializers.Serializer):
    employee_id = serializers.IntegerField()
    name = serializers.CharField()
    marks = serializers.IntegerField()
    percentage = serializers.FloatField()
    level_name = serializers.CharField()
    skill_name = serializers.CharField()
    section = serializers.CharField()


from rest_framework import serializers
from .models import CompanyLogo

class CompanyLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyLogo
        fields = ['id', 'name', 'logo', 'uploaded_at']
from rest_framework import viewsets
from .models import CompanyLogo
from .serializers import CompanyLogoSerializer

from .models import EvaluationPassingCriteria, Level, Department

class EvaluationPassingCriteriaSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source='level.level_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    
    class Meta:
        model = EvaluationPassingCriteria
        fields = ['id', 'level', 'department', 'percentage', 'level_name', 'department_name']



# =================== Retraining start ============================= #

# =================== Retraining start ============================= #

from .models import RetrainingSession, RetrainingConfig, RetrainingSessionDetail

class RetrainingConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetrainingConfig
        fields = "_all_"
      

class RetrainingSessionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = RetrainingSessionDetail
        fields = [
            'id', 'retraining_session', 'observations_failure_points', 
            'trainer_name', 'created_at', 'updated_at'
        ]

class RetrainingSessionSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()
    level_name = serializers.CharField(source='level.level_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    station_name = serializers.CharField(source='station.station_name', read_only=True)
    session_detail = RetrainingSessionDetailSerializer(read_only=True)

    class Meta:
        model = RetrainingSession
        fields = [
            'id', 'employee', 'employee_name', 'level', 'level_name', 'department', 'department_name',
            'station', 'station_name', 'evaluation_type', 'scheduled_date', 'scheduled_time', 'venue',
            'status', 'attempt_no', 'performance_percentage', 'required_percentage', 'created_at', 'session_detail'
        ]

    def get_employee_name(self, obj):
        return f"{obj.employee.first_name or ''} {obj.employee.last_name or ''}".strip()
    

class OperatorPerformanceEvaluationSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=MasterTable.objects.all())
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    station = serializers.PrimaryKeyRelatedField(queryset=Station.objects.all())
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())
    
    passing_percentage = serializers.SerializerMethodField()  # newly added for retraining data

    class Meta:
        model = OperatorPerformanceEvaluation
        fields = [
            'id',
            'employee',
            'date',
            'shift',
            'department',
            'station',
            'level',
            'line',
            # 'process_name',
            'operation_no',
            'date_of_retraining_completed',
            'prepared_by',
            'checked_by',
            'approved_by',
            'is_completed',
            'final_percentage',
            'final_status',
            'created_at',
            'updated_at',
            'passing_percentage',
        ]
    def get_passing_percentage(self, obj):
        from .models import TenCyclePassingCriteria
        try:
            crit = TenCyclePassingCriteria.objects.get(
                level=obj.level,
                department=obj.department,
                station=obj.station
            )
            return crit.passing_percentage
        except TenCyclePassingCriteria.DoesNotExist:
            return 60.0  # fallback default

#=======================10 cycle end ==========================================#


from rest_framework import serializers
from .models import  QuantityPassingCriteria


from rest_framework import serializers
from .models import QuantityScoreSetup

class QuantityScoreSetupSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    level_name = serializers.CharField(source="level.name", read_only=True)

    class Meta:
        model = QuantityScoreSetup
        fields = [
            "id",
            "department", "department_name",
            "level", "level_name",
            "score_type",
            "min_value", "max_value",
            "marks",
        ]



class QuantityPassingCriteriaSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    level_name = serializers.CharField(source="level.name", read_only=True)

    class Meta:
        model = QuantityPassingCriteria
        fields = [
            "id",
            "department", "department_name",
            "level", "level_name",
            "production_passing_percentage",
            "rejection_passing_percentage"
        ]

# =================== Retraining end ============================= #
from rest_framework import serializers
from .models import AssessmentMode

class AssessmentModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentMode
        fields = ['mode', 'updated_at']


class LevelColourSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source='level.level_name', read_only=True)
    level_id = serializers.IntegerField(source='level.level_id', read_only=True)
    level_number = serializers.IntegerField(source='level.level_id', read_only=True)  # Use level_id as level_number
    
    class Meta:
        model = LevelColour
        fields = ['id', 'colour_code', 'level', 'level_name', 'level_id', 'level_number']


class LevelSerializer(serializers.ModelSerializer):
    days = DaysSerializer(many=True, read_only=True)
    subtopics = SubTopicListSerializer(many=True, read_only=True)
    colours = LevelColourSerializer(many=True, read_only=True)

    class Meta:
        model = Level
        fields = ["level_id", "level_name", "days", "subtopics","colours"]

    def create(self, validated_data):
        days_data = validated_data.pop("days", [])
        subtopics_data = validated_data.pop("subtopics", [])

        # Create Level
        level = Level.objects.create(**validated_data)

        # Create Days first
        created_days = []
        for day_data in days_data:
            day_obj = Days.objects.create(level=level, **day_data)
            created_days.append(day_obj)

        # Create SubTopics directly under level
        for st_data in subtopics_data:
            contents_data = st_data.pop("contents", [])
            evaluations_data = st_data.pop("evaluations", [])
            days_id = st_data.pop("days_id", None)

            # Find the days object from created_days
            days_obj = None
            if days_id:
                days_obj = next((d for d in created_days if d.days_id == days_id), None)
            if not days_obj and created_days:
                days_obj = created_days[0]  # Fallback to first day

            subtopic = SubTopic.objects.create(level=level, days=days_obj, **st_data)

            # SubTopicContents
            for content_data in contents_data:
                training_contents_data = content_data.pop("training_contents", [])
                subtopic_content = SubTopicContent.objects.create(subtopic=subtopic, **content_data)
                for tc_data in training_contents_data:
                    TrainingContent.objects.create(subtopiccontent=subtopic_content, **tc_data)

            # Evaluations
            for eval_data in evaluations_data:
                Evaluation.objects.create(subtopic=subtopic, **eval_data)

        return level

from rest_framework import serializers
from .models import SkillMatrixDisplaySetting

class SkillMatrixDisplaySettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillMatrixDisplaySetting
        fields = ['display_shape']




class DepartmentReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = [
            'department_id', 
            'department_name', 
        ]
class LineReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Line
        fields = [
            'line_id', 
            'line_name', 
        ]
class SubLineReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubLine
        fields = [
            'subline_id', 
            'subline_name', 
        ]

class StationReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = [
            'station_id', 
            'station_name', 
        ]





from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    recipient_name = serializers.SerializerMethodField()
    employee_name = serializers.SerializerMethodField()
    level_name = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()
    is_recent = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message', 'notification_type', 'recipient',
            'recipient_name', 'recipient_email', 'employee', 'employee_name',
            'level', 'level_name', 'training_schedule', 'machine_allocation',
            'test_session', 'retraining_session', 'human_body_check_session',
            'is_read', 'is_sent', 'read_at', 'created_at', 'sent_at', 'metadata',
            'priority', 'time_ago', 'is_recent'
        ]
        read_only_fields = ['id', 'created_at', 'sent_at', 'time_ago', 'is_recent']

    def get_recipient_name(self, obj):
        """Get recipient's full name"""
        if obj.recipient:
            return f"{obj.recipient.first_name} {obj.recipient.last_name}".strip()
        return None

    def get_employee_name(self, obj):
        """Get employee's name from MasterTable"""
        if obj.employee:
            return f"{obj.employee.first_name} {obj.employee.last_name}".strip()
        return None

    def get_level_name(self, obj):
        """Get level name from Level model"""
        if obj.level:
            return obj.level.level_name
        return None

    def get_time_ago(self, obj):
        """Get human-readable time difference"""
        from django.utils import timezone
        now = timezone.now()
        diff = now - obj.created_at

        if diff.days > 0:
            return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours > 1 else ''} ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
        else:
            return "Just now"

    def get_is_recent(self, obj):
        """Check if notification is recent (within last 24 hours)"""
        from django.utils import timezone
        from datetime import timedelta
        return obj.created_at > timezone.now() - timedelta(hours=24)


class NotificationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'title', 'message', 'notification_type', 'recipient',
            'recipient_email', 'employee', 'level', 'training_schedule',
            'machine_allocation', 'test_session', 'retraining_session',
            'human_body_check_session', 'priority', 'metadata'
        ]

    def validate(self, data):
        if not data.get('recipient') and not data.get('recipient_email'):
            raise serializers.ValidationError(
                "Either recipient or recipient_email must be specified."
            )
        return data


class NotificationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['is_read', 'read_at']

    def update(self, instance, validated_data):
        if 'is_read' in validated_data:
            if validated_data['is_read'] and not instance.is_read:
                instance.mark_as_read()
            elif not validated_data['is_read'] and instance.is_read:
                instance.mark_as_unread()
        return instance


class NotificationStatsSerializer(serializers.Serializer):
    total_count = serializers.IntegerField()
    unread_count = serializers.IntegerField()
    read_count = serializers.IntegerField()
    recent_count = serializers.IntegerField()
    by_type = serializers.DictField()
    by_priority = serializers.DictField()


# In app1/serializers.py

from rest_framework import serializers
from .models import Score, MasterTable # Make sure models are imported

# ... your other serializers like the original ScoreSerializer can stay here untouched ...


# ADD THIS NEW SERIALIZER CLASS
from rest_framework import serializers
from .models import Score # Make sure Score model is imported

# ... other imports ...

# CORRECTED SERIALIZER CLASS
class LevelOnePassedScoreSerializer(serializers.ModelSerializer):
    """
    A lightweight serializer specifically for listing scores of users who
    have passed an assessment. It includes readable employee and skill names.
    """
    # CHANGE 1: Use SerializerMethodField for custom fields not on the model.
    employee_details = serializers.SerializerMethodField()
    skill_name = serializers.SerializerMethodField()

    class Meta:
        model = Score
        # The fields list remains the same, as this is the desired output.
        fields = [
            'id',
            'employee_details',
            'skill_name',
            'marks',
            'percentage',
            'created_at'
        ]

    # NEW METHOD 1: This function provides the value for 'employee_details'.
    # The name must be get_<field_name>.
    def get_employee_details(self, obj):
        # 'obj' is the Score instance being serialized.
        # We assume your Score model has a ForeignKey to MasterTable named 'employee'.
        if obj.employee:
            return obj.employee.__str__()  # This calls the "FirstName LastName (EMP_ID)" method
        return "Unknown Employee"

    # NEW METHOD 2: This function provides the value for 'skill_name'.
    def get_skill_name(self, obj):
        # We assume your Score model has a ForeignKey to your Skill/Station model named 'skill'.
        if obj.skill:
            # We also assume the skill model has a field called 'station_name'.
            return obj.skill.station_name
        return "Unknown Skill"


# In serializers.py
from rest_framework import serializers
from .models import HandoverSheet, MasterTable, Department
from django.db import transaction

# ... (MasterTableSerializer, DepartmentSerializer are here) ...

class HandoverSheetCreateSerializer(serializers.ModelSerializer):
    emp_id = serializers.CharField(write_only=True)
    distributed_department_name = serializers.CharField(write_only=True)

    class Meta:
        model = HandoverSheet
        fields = [
            'emp_id',
            'industrial_experience',
            'kpapl_experience',
            'required_department_at_handover',
            'distributed_department_name',
            'handover_date',
            'contractor_name',
            'p_and_a_name',
            'qa_hod_name',
            'is_training_completed',
            'gojo_incharge_name',
        ]

    def create(self, validated_data):
        emp_id = validated_data.pop("emp_id")
        dept_name = validated_data.pop("distributed_department_name")
        is_training_completed = validated_data.pop("is_training_completed")
        training_completed_bool = (is_training_completed == "yes")

        employee = MasterTable.objects.get(emp_id=emp_id)
        department = Department.objects.get(department_name=dept_name)

        # Instead of always creating → create_or_update
        handover, created = HandoverSheet.objects.update_or_create(
            employee=employee,
            defaults={
                **validated_data,
                "distributed_department_after_dojo": department,
                "is_training_completed": training_completed_bool,
            }
        )

        # ALWAYS update MasterTable department
        employee.department = department
        employee.save()

        return handover
    

    from rest_framework import serializers
from .models import LevelWiseTrainingContent, TrainingTopic

class LevelWiseTrainingContentSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source="level.level_name", read_only=True)
    station_name = serializers.CharField(source="station.station_name", read_only=True)
    topic_name = serializers.CharField(source="topic.topic_name", read_only=True)  # show topic name

    class Meta:
        model = LevelWiseTrainingContent
        fields = [
            "id",
            "topic",        # FK id for create/update
            "topic_name",   # read-only name of topic
            "level",
            "level_name",
            "station",
            "station_name",
            "content_name",
            "file",
            "url",
            "updated_at",
        ]

from rest_framework import serializers
from .models import TrainingTopic

class TrainingTopicSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source="level.level_name", read_only=True)
    station_name = serializers.CharField(source="station.station_name", read_only=True)
    
    class Meta:
        model = TrainingTopic
        fields = [
            "id",
            "topic_name",
            "level",        # FK id for create/update
            "level_name",   # read-only name of level
            "station",      # FK id for create/update
            "station_name", # read-only name of station
        ]


    



class DailyProductionDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyProductionData
        fields = '__all__'


from rest_framework import serializers
from .models import SkillMatrix

class SkillMatrixSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source="level.level_name", read_only=True)
    station_name = serializers.CharField(source="hierarchy.station.station_name", read_only=True)
    department_name = serializers.CharField(source="hierarchy.department.department_name", read_only=True)
    station_id = serializers.IntegerField(source="hierarchy.station.station_id", read_only=True)
    
    class Meta:
        model = SkillMatrix
        fields = [
            "id",
            "employee_name",
            "emp_id",
            "doj",
            "level",
            "level_name",
            "hierarchy",
            "station_name",
            "station_id",
            "department_name",
            "updated_at",
]

from .models import UserManualdocs

class UserManualdocsSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    file_name = serializers.SerializerMethodField()
    
    class Meta:
        model = UserManualdocs
        fields = [
            'id', 
            'name', 
            'file', 
            'uploaded_at', 
            'updated_at',
            'file_url',
            'file_name',
            'file_extension'
        ]
        read_only_fields = ['uploaded_at', 'updated_at']

    def get_file_url(self, obj):
        """Get the full URL for the file"""
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

    def get_file_name(self, obj):
        """Get the original filename"""
        if obj.file:
            return obj.file.name.split('/')[-1]  # Get just the filename
        return None

    def validate(self, data):
        """Custom validation to ensure file is provided"""
        file_data = data.get('file')
        
        if not file_data:
            raise serializers.ValidationError(
                "File is required."
            )
        
        return data
    
from .models import EvaluationPassingCriteria, Level, Department

class EvaluationPassingCriteriaSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source='level.level_name', read_only=True)
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    
    class Meta:
        model = EvaluationPassingCriteria
        fields = ['id', 'level', 'department', 'percentage', 'level_name', 'department_name']



# =================== TrainingAttendance ============================= #


from .models import TrainingBatch,TrainingAttendance

class TrainingBatchSerializer(serializers.ModelSerializer):
    """ Serializer for the TrainingBatch model. """
    class Meta:
        model = TrainingBatch
        fields = ['batch_id', 'is_active', 'created_at']


class TrainingAttendanceSerializer(serializers.ModelSerializer):
    """ Serializer for creating/updating individual attendance records. """
    user = serializers.PrimaryKeyRelatedField(queryset=UserRegistration.objects.all())
    # The attendance_date is set by the server, so it's read-only for clients.
    attendance_date = serializers.DateField(read_only=True) 

    class Meta:
        model = TrainingAttendance
        fields = ['user', 'batch', 'day_number', 'status', 'attendance_date']


class CardTrainingAttendanceSerializer(serializers.ModelSerializer):
    """
    Serializer specifically for showing attendance in the Employee Card view.
    """
    # Get the batch_id string directly instead of the related object ID
    batch = serializers.CharField(source='batch.batch_id', read_only=True)

    class Meta:
        model = TrainingAttendance
        # These fields match what your React interface expects
        fields = ['id', 'batch', 'day_number', 'status', 'attendance_date']


class UserForAttendanceSerializer(serializers.ModelSerializer):
    """ A simplified User serializer for nesting inside the attendance detail view. """
    attendances = serializers.SerializerMethodField()

    class Meta:
        model = UserRegistration
        fields = ['id', 'first_name', 'temp_id', 'attendances']

    def get_attendances(self, obj):
        batch_id = self.context.get('batch_id')
        if not batch_id:
            return {}
        attendances = TrainingAttendance.objects.filter(user=obj, batch=batch_id)
        return {att.day_number.days_id: att.status for att in attendances}
    


    

class BatchAttendanceDetailSerializer(serializers.Serializer):
    """
    Custom serializer for the main attendance page response.
    Combines batch info, the next day to mark, and the list of users.
    """
    batch_id = serializers.CharField()
    next_training_day_to_mark = serializers.IntegerField(allow_null=True)
    is_completed = serializers.BooleanField()
    users = UserForAttendanceSerializer(many=True)


# =================== TrainingAttendance End ============================= #





from rest_framework import serializers
from .models import AdvanceManpowerDashboard

class AdvanceManpowerDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdvanceManpowerDashboard
        fields = "__all__"



# serializers.py (CORRECTED)

from rest_framework import serializers
from .models import ManagementReview, Hq, Factory, Department
from django.utils import timezone

class ManagementReviewSerializer(serializers.ModelSerializer):
    # This section tells the serializer how to handle the ForeignKey fields.
    # Instead of expecting an ID, it will expect a 'name' and look it up.
    hq = serializers.SlugRelatedField(
        slug_field='hq_name',
        queryset=Hq.objects.all(),
        required=False, # Matches model's null=True, blank=True
        allow_null=True
    )
    factory = serializers.SlugRelatedField(
        slug_field='factory_name',
        queryset=Factory.objects.all()
    )
    department = serializers.SlugRelatedField(
        slug_field='department_name',
        queryset=Department.objects.all(),
        required=False, # Matches model's null=True, blank=True
        allow_null=True
    )

    # Adding explicit validation for month and year is a good practice.
    month = serializers.IntegerField(min_value=1, max_value=12)
    year = serializers.IntegerField(min_value=2000, max_value=timezone.now().year + 5)

    class Meta:
        model = ManagementReview
        fields = '__all__' # This includes all fields from the model
        
        # This validator is crucial for preventing duplicate entries and
        # will return a clean error message to the user if they try.
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=ManagementReview.objects.all(),
                fields=('hq', 'factory', 'department', 'month', 'year'),
                message="A review for this combination of HQ, Factory, Department, Month, and Year already exists."
            )
        ]



class BaseManagementReviewSerializer(serializers.ModelSerializer):
    """A base serializer to provide the 'month_year' field."""
    month_year = serializers.SerializerMethodField()

    class Meta:
        model = ManagementReview
        abstract = True 

    def get_month_year(self, obj):
        return f"{obj.year}-{str(obj.month).zfill(2)}"


# --- Now, we use the base serializer to build the others ---

class TrainingDataSerializer(BaseManagementReviewSerializer):
    class Meta:
        model = ManagementReview
        # FIX: Replaced non-existent 'month_year' with the one from our base serializer
        fields = ['month_year', 'new_operators_joined', 'new_operators_trained', 
                  'total_training_plans', 'total_trainings_actual']

class DefectsDataSerializer(BaseManagementReviewSerializer):
    class Meta:
        model = ManagementReview
        # FIX: Replaced non-existent 'month_year'
        fields = ['month_year', 'total_defects_msil', 'ctq_defects_msil', 
                  'total_defects_tier1', 'ctq_defects_tier1', 
                  'total_internal_rejection', 'ctq_internal_rejection']

class OperatorsChartSerializer(BaseManagementReviewSerializer):
    # We can rename fields directly from the model using the 'source' argument
    operators_joined = serializers.IntegerField(source='new_operators_joined')
    operators_trained = serializers.IntegerField(source='new_operators_trained')
    
    class Meta:
        model = ManagementReview
        fields = ['year', 'month_year', 'operators_joined', 'operators_trained']

class TrainingPlansChartSerializer(BaseManagementReviewSerializer):
    training_plans = serializers.IntegerField(source='total_training_plans')
    trainings_actual = serializers.IntegerField(source='total_trainings_actual')
    
    class Meta:
        model = ManagementReview
        fields = ['year', 'month_year', 'training_plans', 'trainings_actual']

class DefectsChartSerializer(BaseManagementReviewSerializer):
    defects_msil = serializers.IntegerField(source='total_defects_msil')

    class Meta:
        model = ManagementReview
        fields = ['year', 'month_year', 'defects_msil', 'ctq_defects_msil']



from rest_framework import serializers
from .models import MasterTable

class CardEmployeeMasterSerializer(serializers.ModelSerializer):
    department = serializers.CharField(source='department.department_name', read_only=True)
    class Meta:
        model = MasterTable
        fields = [
            'emp_id','first_name','last_name','department','date_of_joining','birth_date',
            'sex','email','phone',
        ]



#no model now
# class OperatorCardSkillSerializer(serializers.ModelSerializer):
#     operator_name = serializers.CharField(source='operator.name', read_only=True)
#     station_skill = serializers.CharField(source='station.skill', read_only=True)

#     class Meta:
#         model = OperatorSkill
#         fields = ['id', 'operator_name', 'station_skill', 'skill_level', 'sequence']  

class OperatorCardSkillSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)
    station_name = serializers.CharField(source='hierarchy.station.station_name', read_only=True)
    level_name = serializers.CharField(source='level.level_name', read_only=True)

    class Meta:
        model = SkillMatrix
        fields = ['id', 'employee_name', 'station_name', 'level_name', 'updated_at']  
        # fields = ['id', 'operator_name', 'station_name', 'level_name', 'sequence']  



from rest_framework import serializers
from .models import Score

class CardScoreSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)
    test_name = serializers.CharField(source='test.test_name', read_only=True)

    class Meta:
        model = Score
        fields = [
            'id',
            'employee_name',
            'test_name',     # just use directly if it's a model field
            'marks',
            'percentage',    # must exist in model
            'passed',        # must exist in model
            'created_at'
        ]




# from rest_framework import serializers
# from .models import MultiSkilling

# class CardMultiSkillingSerializer(serializers.ModelSerializer):
#     employee_name = serializers.CharField(source='employee.name', read_only=True)
#     station_number = serializers.IntegerField(source='station.station_number', read_only=True)
#     skill_level_value = serializers.CharField(source='skill_level.skill_level', read_only=True)
#     skill = serializers.CharField(source='station.skill', read_only=True, allow_null=True)

#     class Meta:
#         model = MultiSkilling
#         fields = [
#             'id',
#             'employee_name',
#             'station_number',
#             'skill',
#             'skill_level_value',
#             'start_date',
#             'end_date',
#             'notes',
#             'status',
#             'reason',
#             'refreshment_date'
#         ]



#not understand the model 
# from rest_framework import serializers
# from .models import RefreshmentTraining

# class CardRefreshmentTrainingSerializer(serializers.ModelSerializer):
#     employee_name = serializers.CharField(source='employee.name', read_only=True)
#     card_no = serializers.CharField(source='employee.card_no', read_only=True)
#     station_number = serializers.IntegerField(source='station.station_number', read_only=True)
#     skill_name = serializers.CharField(source='skill.skill', read_only=True)
#     skill_level_value = serializers.CharField(source='skill_level.skill_level', read_only=True)

#     class Meta:
#         model = RefreshmentTraining
#         fields = [
#             'id',
#             'employee_name',
#             'card_no',
#             'station_number',
#             'skill_name',
#             'skill_level_value',
#             'start_date',
#             'end_date',
#             'reason_for_refreshment',
#         ]

# THIS IS THE UPDATED VERSION
class CardScheduleSerializer(serializers.ModelSerializer):
    """
    This serializer takes a Schedule object and formats it for the
    employee history card.
    """
    
    # ★ GET related names instead of IDs
    trainer_name = serializers.CharField(source='trainer.name', read_only=True, allow_null=True)
    venue_name = serializers.CharField(source='venue.name', read_only=True, allow_null=True)

    # ★ RENAME 'training_name.topic' to be more descriptive
    topic = serializers.CharField(source='training_name.topic', read_only=True)
    
    # ★ GET the category name
    category_name = serializers.CharField(source='training_category.name', read_only=True)

    class Meta:
        model = Schedule
        # ★ UPDATE the fields list with the new data
        fields = [
            'id',
            'topic',
            'category_name',
            'trainer_name',
            'venue_name',
            'status',
            # 'created_at',
            'date'
            # 'time',  # Let's add time as well, it's useful!
        ]
    # --- ★ START: ADD THESE MISSING METHODS ★ ---


#955
# # ★★★ NEW SERIALIZER FOR THE EMPLOYEE HISTORY CARD ★★★
# class CardHanchouExamResultSerializer(serializers.ModelSerializer):
#     """
#     A read-only serializer to format Hanchou exam results for the employee card view.
#     It provides a clean, flat structure.
#     """
#     # The 'percentage' field is a @property on the model, so we declare it here
#     # to ensure it's included in the serialization.
#     percentage = serializers.FloatField(read_only=True)

#     class Meta:
#         model = HanchouExamResult
#         # List the specific fields you want to show in "Card 6" of your React component.
#         fields = [
#             'id',
#             'exam_name',
#             'score',
#             'total_questions',
#             'percentage',
#             'passed',
#             'submitted_at',
#         ]



#2331
# class CardTrainingAttendanceSerializer(serializers.ModelSerializer):
#     """
#     Serializer specifically for showing attendance in the Employee Card view.
#     """
#     # Get the batch_id string directly instead of the related object ID
#     batch = serializers.CharField(source='batch.batch_id', read_only=True)

#     class Meta:
#         model = TrainingAttendance
#         # These fields match what your React interface expects
#         fields = ['id', 'batch', 'day_number', 'status', 'attendance_date']





# ==================== MultiSkilling Start ======================== #



from rest_framework import serializers
from .models import MultiSkilling, SkillMatrix


class MultiSkillingSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(read_only=True)
    emp_id = serializers.CharField(read_only=True)
    department_name = serializers.CharField(read_only=True)   # snapshot from MasterTable
    current_status = serializers.SerializerMethodField()

    station_name = serializers.CharField(source="station.station_name", read_only=True)
    department_display = serializers.CharField(
        source="department.department_name", read_only=True
    )

    class Meta:
        model = MultiSkilling
        fields = [
            "id", "employee", "emp_id", "employee_name", "department_name", "date_of_joining",
            "department", "station", "station_name", "department_display",
            "skill_level",
            "start_date", "remarks", "status", "current_status",
            "created_at", "updated_at",
        ]

    def get_current_status(self, obj):
        """
        1. If scheduled and date <= today → in-progress
        2. If a matching SkillMatrix row exists for this employee & station with >= skill_level → completed
        """
        # today = obj.start_date
        # Default property status logic
        status_val = obj.current_status

        # Check completion in SkillMatrix
        skill_exists = SkillMatrix.objects.filter(
            employee=obj.employee,
            hierarchy__station=obj.station,
             level__level_name=obj.skill_level.level_name  # compare with required level
        ).exists()

        if skill_exists:
            return "completed"

        return status_val


# ==================== MultiSkilling End ======================== #



from .models import Machine, MachineAllocation,SkillMatrix

class MachineSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    class Meta:
        model = Machine
        fields = "__all__"

    def create(self, validated_data):
        return Machine.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def delete(self, instance):
        # Custom delete if you want control
        instance.delete()
        return instance





class MachineAllocationSerializer(serializers.ModelSerializer):
    machine_name = serializers.CharField(source='machine.name', read_only=True)
    machine_level = serializers.IntegerField(source='machine.level', read_only=True)
    employee_name = serializers.CharField(source='employee.employee_name', read_only=True)
    employee_level = serializers.IntegerField(source='employee.level.level_id', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = MachineAllocation
        fields = "__all__"
        read_only_fields = ('approval_status', 'allocated_at')  # These are auto-determined

    def create(self, validated_data):
        # The approval_status will be automatically set in the model's save method
        return MachineAllocation.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()  # This will trigger the auto-approval logic
        return instance

    def validate(self, data):
        """
        Check if the allocation already exists
        """
        machine = data.get('machine')
        employee = data.get('employee')
        
        # If this is an update, exclude current instance
        if self.instance:
            existing = MachineAllocation.objects.filter(
                machine=machine, 
                employee=employee
            ).exclude(id=self.instance.id)
        else:
            existing = MachineAllocation.objects.filter(
                machine=machine, 
                employee=employee
            )
        
        if existing.exists():
            raise serializers.ValidationError(
                "This employee is already allocated to this machine."
            )
        
        return data

    def validate_employee(self, value):
            """
            Ensure the employee ID exists in SkillMatrix
            """
            try:
                SkillMatrix.objects.get(id=value.id if hasattr(value, 'id') else value)
            except SkillMatrix.DoesNotExist:
                raise serializers.ValidationError("Employee not found in skill matrix.")
            return value

# For the eligible employees endpoint
class EligibleEmployeeSerializer(serializers.ModelSerializer):
    level_value = serializers.IntegerField(source='level.level_id', read_only=True)
    is_eligible = serializers.SerializerMethodField()
    department_id = serializers.IntegerField(source='hierarchy.department.department_id', read_only=True)
    
    class Meta:
        model = SkillMatrix
        fields = ['id', 'employee_name', 'emp_id', 'level_value', 'is_eligible', 'department_id']
    
    def get_is_eligible(self, obj):
        machine_level = self.context.get('machine_level', 0)
        return obj.level.level_id >= machine_level
    




from rest_framework import serializers
from .models import EvaluationLevel2, EvaluationScore, MasterTable
import django.db.transaction # Import transaction module



class EvaluationScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationScore
        fields = ['criteria_text', 'initial_score', 'reevaluation_score']



class EvaluationLevel2Serializer(serializers.ModelSerializer):
    scores = EvaluationScoreSerializer(many=True)
    employee = serializers.SlugRelatedField(
        slug_field='emp_id',
        queryset=MasterTable.objects.all()
    )
    employee_id_str = serializers.CharField(source='employee.emp_id', read_only=True)
    level = serializers.PrimaryKeyRelatedField(queryset=Level.objects.all())
    level_name = serializers.CharField(source='level.level_name', read_only=True)
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    department_name = serializers.CharField(source='department.department_name', read_only=True)


    class Meta:
        model = EvaluationLevel2
        fields = [
            'id', 
            'employee',
            'department',
            'department_name',
            'level',
            'level_name',
            'employee_id_str', 
            'station_name', 
            'evaluation_date', 
            'dojo_incharge_name', 
            'area_incharge_name', 
            'total_marks', 
            'status', 
            'scores',
            'snapshot_full_name',
            'snapshot_department',
            'snapshot_designation',
            'snapshot_date_of_joining',
            'created_at'
        ]
        read_only_fields = [
            'status', 
            'snapshot_full_name', 
            'snapshot_department',
            'snapshot_designation',
            'snapshot_date_of_joining'
        ]

        extra_kwargs = {
            'employee': {'write_only': True}
        }

    def _calculate_status(self, scores_data):
        initial_fail = any(score.get('initial_score') == 'X' for score in scores_data)
        if not initial_fail:
            return EvaluationLevel2.STATUS_PASS

        re_eval_attempted = any(score.get('reevaluation_score') is not None for score in scores_data)
        if not re_eval_attempted:
            return EvaluationLevel2.STATUS_FAIL

        re_eval_fail = any(score.get('reevaluation_score') == EvaluationScore.SCORE_NG for score in scores_data)
        if re_eval_fail:
            return EvaluationLevel2.STATUS_RE_EVAL_FAIL
        else:
            return EvaluationLevel2.STATUS_RE_EVAL_PASS


    @django.db.transaction.atomic
    def create(self, validated_data):
        scores_data = validated_data.pop('scores')
        validated_data['status'] = self._calculate_status(scores_data)

        # --- ✅ CORRECTED LOGIC ---
        # 1. Create a model instance in memory, but don't hit the database yet.
        evaluation = EvaluationLevel2(**validated_data)

        # 2. Now, explicitly call the .save() method. 
        #    This will trigger your custom logic in models.py to populate the snapshot fields.
        evaluation.save()
        # --- END OF FIX ---

        # The rest of the code remains the same
        for score_data in scores_data:
            EvaluationScore.objects.create(evaluation=evaluation, **score_data)
        return evaluation

    def update(self, instance, validated_data):
        """
        Handle updates for the evaluation and its nested scores.
        """

        scores_data = validated_data.pop('scores', None)

        instance = super().update(instance, validated_data)

        if scores_data is not None:

            instance.scores.all().delete()
            

            for score_data in scores_data:
                EvaluationScore.objects.create(evaluation=instance, **score_data)

            instance.status = self._calculate_status(scores_data)
            instance.save()

        return instance


from rest_framework import serializers
from .models import EvaluationCriterion

class EvaluationCriterionSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source='level.level_name', read_only=True)
    class Meta:
        model = EvaluationCriterion
        fields = ['id', 'level', 'level_name', 'criteria_text', 'display_order', 'is_active']

        # extra_kwargs = {
        #     'level': {'write_only': True}
        # }
        

from .models import MasterTable, Department, ProductivityEvaluation, ProductivitySequence,QualitySequence,QualityEvaluation



class MasterTableemployeeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = MasterTable
        fields = [
            "emp_id", "first_name", "last_name", "full_name",
            "designation", "department", "date_of_joining"
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class ProductivitySequenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductivitySequence
        fields = "__all__"


class ProductivityEvaluationSerializer(serializers.ModelSerializer):
    employee_details = MasterTableemployeeSerializer(source="employee", read_only=True)
    sequences = ProductivitySequenceSerializer(many=True, read_only=True)

    class Meta:
        model = ProductivityEvaluation
        fields = "__all__"





class QualitySequenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualitySequence
        fields = "__all__"


class QualityEvaluationSerializer(serializers.ModelSerializer):
    employee_details = MasterTableemployeeSerializer(source="employee", read_only=True)
    qualitysequences = QualitySequenceSerializer(many=True, read_only=True)

    class Meta:
        model = QualityEvaluation
        fields = "__all__"        



# level1revision
from rest_framework import serializers
from .models import Question, Option # Import new models

# ... your existing serializers ...

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'option_text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    # This field will be used for both reading existing options
    # and accepting new options when creating a question.
    options = OptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'options', 'subtopiccontent']
        # Make subtopiccontent write-only in this context,
        # as it's needed for creation but not for display within the nested structure.
        extra_kwargs = {
            'subtopiccontent': {'write_only': True}
        }

    def create(self, validated_data):
        """
        This custom create method handles the nested options.
        """
        # Pop the nested options data from the validated data
        options_data = validated_data.pop('options')
        
        # Create the Question instance first
        question = Question.objects.create(**validated_data)
        
        # Now, loop through the options data and create each Option,
        # linking it to the question we just created.
        for option_data in options_data:
            Option.objects.create(question=question, **option_data)
            
        return question
    
    def update(self, instance, validated_data):
        # Update the question's text
        instance.question_text = validated_data.get('question_text', instance.question_text)
        instance.save()

        # Get the new options data
        options_data = validated_data.get('options')

        # Delete old options
        instance.options.all().delete()

        # Create new options
        for option_data in options_data:
            Option.objects.create(question=instance, **option_data)

        return instance
    
# end revision

# Operator observance sheet 

from rest_framework import serializers
from .models import Topic, OperatorObservanceSheet

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'sr_no', 'topic_name', 'description']  # Added 'id'

class OperatorObservanceSheetSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)
    class Meta:
        model = OperatorObservanceSheet
        fields = '__all__'
