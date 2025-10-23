from django.urls import include, path,include
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

from django.conf import settings
from django.conf.urls.static import static

from rest_framework.routers import DefaultRouter
from .views import ARVRTrainingContentViewSet, ActiveTrainingBatchListView, BatchAttendanceDetailView, AdvanceManpowerDashboardViewSet, BodyCheckSubmissionView, BulkAttendanceUpdateView, CompanyLogoViewSet, CompleteTrainingBatchView, CurrentMonthDefectsDataView, CurrentMonthTrainingDataView,  CurriculumContentViewSet, CurriculumViewSet, DailyProductionDataViewSet, DaysViewSet, DefectsChartView, DepartmentStationViewSet, DepartmentSubLineViewSet, EmployeeAttendanceViewSet, EmployeeCardDetailsView, EmployeeExcelViewSet, EmployeeHandoverView, EmployeeSkillSearch, EvaluationCriterionViewSet, EvaluationLevel2ViewSet, EvaluationViewSet, HanContentViewSet, HanSubtopicViewSet, HanTrainingContentViewSet, HanchouExamQuestionViewSet, HanchouExamResultViewSet, HanchouResultCertificatePDF, HandoverSheetViewSet, HierarchyAllDepartmentsView, HierarchyByDepartmentView, HierarchyStructureViewSet,  HqViewSet, FactoryViewSet, DepartmentViewSet, HumanBodyQuestionsViewSet, KeyEventCreateView, LatestKeyEventView, Level2QuantityOJTEvaluationViewSet, LevelColourViewSet, LevelOnePassedUsersView, LevelViewSet, LevelWiseTrainingContentViewSet, LineViewSet, MachineAllocationApprovalViewSet, MachineAllocationViewSet, MachineViewSet, ManagementReviewViewSet, MasterTableViewSet, MultiSkillingViewSet, NotificationViewSet, OJTDayListView, OJTDayViewSet, OJTLevel2QuantityViewSet, OJTPassingCriteriaViewSet, OJTScoreRangeViewSet, OJTScoreViewSet, OJTTopicListView, OJTTopicViewSet, PastTrainingBatchListView, OperatorsChartView,  ProductionPlanViewSet, ProductivityEvaluationViewSet, ProductivitySequenceViewSet, QualityEvaluationViewSet, QualitySequenceViewSet, QuantityOJTScoreRangeViewSet, QuantityPassingCriteriaViewSet, QuestionPaperViewSet, QuestionViewSet, RescheduleLogViewSet, RetrainingConfigViewSet, RetrainingSessionViewSet, RoleViewSet, ScheduleViewSet, ShoContentViewSet, ShoSubtopicViewSet, ShoTrainingContentViewSet, ShokuchouExamQuestionViewSet, ShokuchouExamResultViewSet, ShokuchouResultCertificatePDF, SkillMatrixDisplaySettingViewSet, SkillMatrixViewSet, StationLevelQuestionPaperViewSet, StationSettingCreateView, SubLineViewSet, StationViewSet, SubTopicContentViewSet, SubTopicViewSet, SubmitWebTestAPIView, TemplateQuestionViewSet,  TraineeInfoListView, TraineeInfoViewSet, Trainer_nameViewSet, Training_categoryViewSet, TrainingContentViewSet, TrainingPlansChartView, TrainingTopicViewSet, UserBodyCheckListView, UserRegistrationViewSet, UserViewSet, VenueViewSet, create_system_notification, create_test_notification, delete_all_notifications, notification_count, serve_han_material_file, serve_sho_material_file,EvaluationPassingCriteriaViewSet, test_notifications, trigger_all_notification_types, trigger_employee_notification
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TenCycleDayConfigurationViewSet,
    TenCycleTopicsViewSet,
    TenCycleSubTopicViewSet,
    TenCyclePassingCriteriaViewSet,
    OperatorPerformanceEvaluationViewSet,
    EvaluationSubTopicMarksViewSet,TenCycleConfigurationViewSet,TopicViewSet,OperatorObservanceSheetViewSet
)
from .views import get_sheet_by_operator_level_station



router = DefaultRouter()
router.register(r'hq', HqViewSet, basename='hq')
router.register(r'factories', FactoryViewSet, basename='factory')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'lines', LineViewSet, basename='line')
router.register(r'sublines', SubLineViewSet, basename='subline')
router.register(r'stations', StationViewSet, basename='station')
router.register(r'hierarchy-structures', HierarchyStructureViewSet, basename='hierarchy-structure')


#10 cycle

router.register(r'tencycle-days', TenCycleDayConfigurationViewSet, basename='tencycle-day')
router.register(r'tencycle-topics', TenCycleTopicsViewSet, basename='tencycle-topic')
router.register(r'tencycle-subtopics', TenCycleSubTopicViewSet, basename='tencycle-subtopic')
router.register(r'tencycle-passingcriteria', TenCyclePassingCriteriaViewSet, basename='tencycle-passingcriteria')
router.register(r'operator-evaluations', OperatorPerformanceEvaluationViewSet, basename='operator-evaluation')
router.register(r'evaluation-marks', EvaluationSubTopicMarksViewSet, basename='evaluation-mark')
router.register(r'tencycle-configuration', TenCycleConfigurationViewSet, basename='tencycle-configuration')


router.register(r'levels', LevelViewSet)
router.register(r'days', DaysViewSet)
router.register(r'subtopics', SubTopicViewSet)
router.register(r'subtopic-contents', SubTopicContentViewSet)
router.register(r'training-contents', TrainingContentViewSet)
router.register(r'evaluations', EvaluationViewSet)
router.register(r'mastertable', MasterTableViewSet, basename='mastertable')
router.register(r'humanbody-questions', HumanBodyQuestionsViewSet, basename='humanbody-questions')
router.register(r'production-plans', ProductionPlanViewSet, basename='production-plan')

router.register(r'machines', MachineViewSet, basename='machines')
router.register(r'allocations', MachineAllocationViewSet, basename='allocations')

router.register(r'machine-allocation-approval', MachineAllocationApprovalViewSet, basename='machineallocationapproval')


router.register(r'questionpapers', QuestionPaperViewSet, basename='questionpaper')
router.register(r'station-level-questionpapers', StationLevelQuestionPaperViewSet, basename='stationlevelquestionpaper')
router.register(r'arvr-content', ARVRTrainingContentViewSet, basename='arvr-content')




router.register(r'template-questions', TemplateQuestionViewSet, basename='templatequestion')


# hanshou & shokuchou 

router.register(r'hanchou-questions', HanchouExamQuestionViewSet, basename='hanchou-questions')
router.register(r"hanchou/results", HanchouExamResultViewSet, basename="hanchou-results")

router.register(r"shokuchou-questions", ShokuchouExamQuestionViewSet, basename="shokuchou-questions")
router.register(r"shokuchou/results", ShokuchouExamResultViewSet, basename="shokuchou-results")


router.register(r'han-content', HanContentViewSet, basename='han-content')
router.register(r'han-subtopics', HanSubtopicViewSet,  basename='han-subtopic') 
router.register(r'han-materials', HanTrainingContentViewSet, basename='han-material')

router.register(r'sho-content', ShoContentViewSet, basename='sho-content')
router.register(r'sho-subtopics', ShoSubtopicViewSet, basename='sho-subtopic')
router.register(r'sho-materials', ShoTrainingContentViewSet, basename='sho-material')




router.register(r'ojt-topics', OJTTopicViewSet, basename='ojt-topic')
router.register(r'ojt-days', OJTDayViewSet, basename='ojt-day')
router.register(r'ojt-score-ranges', OJTScoreRangeViewSet, basename='ojt-scorerange')
router.register(r'ojt-scores', OJTScoreViewSet)
router.register(r'ojt-passing-criteria', OJTPassingCriteriaViewSet)
router.register(r'trainees', TraineeInfoViewSet, basename='trainees')
router.register(r"ojt-quantity", OJTLevel2QuantityViewSet)


# Refreshment Training
router.register(r'training-categories', Training_categoryViewSet)
router.register(r'curriculums', CurriculumViewSet, basename='curriculum')
router.register(r'curriculum-contents', CurriculumContentViewSet, basename='curriculumcontent')
router.register(r'trainer_name', Trainer_nameViewSet)
router.register(r'venues', VenueViewSet)
router.register(r'schedules', ScheduleViewSet)
router.register(r'empattendances', EmployeeAttendanceViewSet, basename='attendance')
router.register(r'reschedule-logs', RescheduleLogViewSet, basename='reschedulelog')


router.register(r"score-ranges", QuantityOJTScoreRangeViewSet, basename="quantity-score-range")
router.register(r"passing-criteria", QuantityPassingCriteriaViewSet, basename="quantity-passing-criteria")
router.register(r"ojt-evaluations", Level2QuantityOJTEvaluationViewSet)


router.register(r'logos', CompanyLogoViewSet)
router.register(r'evaluation-passing-criteria', EvaluationPassingCriteriaViewSet, basename='evaluation-passing-criteria')



router.register(r'retraining-sessions', RetrainingSessionViewSet, basename='retraining-session')
router.register(r'retraining-configs', RetrainingConfigViewSet, basename='retraining-config')
router.register(r'notifications', NotificationViewSet, basename='notifications')

router.register(r'levelcolours', LevelColourViewSet, basename="levelcolours")
router.register(r'displaysetting', SkillMatrixDisplaySettingViewSet, basename='displaysetting')

router.register(r'department-sublines', DepartmentSubLineViewSet, basename='department-sublines')
router.register(r'department-stations', DepartmentStationViewSet, basename='department-stations')


router.register(r"users", UserViewSet, basename="user")
router.register(r'roles', RoleViewSet, basename='role')

router.register(r'handovers', HandoverSheetViewSet, basename='handover')

router.register(r'production-data', DailyProductionDataViewSet, basename='productiondata')

router.register( r"training_topics", TrainingTopicViewSet, basename="training_topic")
router.register(r"levelwise-training-contents", LevelWiseTrainingContentViewSet, basename="levelwisetrainingcontent")

router.register(r"skill-matrix", SkillMatrixViewSet, basename="skill-matrix")



router.register(r'advance-dashboard', AdvanceManpowerDashboardViewSet, basename='advance-dashboard')
router.register(r'management-reviews', ManagementReviewViewSet, basename='managementreview')


router.register(r'employees-excel', EmployeeExcelViewSet, basename='employee-excel')


router.register(r"multiskilling", MultiSkillingViewSet, basename="multiskilling")

router.register(r'skillevaluations', EvaluationLevel2ViewSet, basename='evaluation-level2')
router.register(r'criteria', EvaluationCriterionViewSet, basename='criterion')


# level 1 productivity and quality sheet 
router.register(r"productivityevaluations", ProductivityEvaluationViewSet)
router.register(r"sequences", ProductivitySequenceViewSet)
router.register(r"qualityevaluations", QualityEvaluationViewSet)
router.register(r"qualitysequences", QualitySequenceViewSet)

router.register(r'questions', QuestionViewSet)
# operator observance sheet
router.register(r'topics', TopicViewSet, basename='topic')
router.register(r'observancesheets', OperatorObservanceSheetViewSet, basename='observancesheet')

urlpatterns = [

    path('register/', views.RegisterView.as_view(), name="register"),
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('logout/', views.LogoutAPIView.as_view(), name="logout"),

    
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('api/', include(router.urls)),
    path('temp-user-info/', UserRegistrationViewSet.as_view({'get': 'list', 'post': 'create'}), name='temp-user-info'),
    path('users/<str:temp_id>/', UserRegistrationViewSet.as_view({'get': 'retrieve', 'patch': 'partial_update', 'put': 'update'}), name='user-update'),
    # Body check endpoints
    path('human-body-checks/', BodyCheckSubmissionView.as_view(), name='human-body-checks'),
    path('user-body-checks/', UserBodyCheckListView.as_view(), name='user-body-checks'),


    path('han-materials/<int:pk>/serve/', serve_han_material_file, name='serve-han-material-file'),

    # URL for Shokuchou files
    path('sho-materials/<int:pk>/serve/', serve_sho_material_file, name='serve-sho-material-file'),

    path('hanchou-results/<int:pk>/download-certificate/', HanchouResultCertificatePDF.as_view(), name='download-hanchou-certificate'),
    path('shokuchou-results/<int:pk>/download-certificate/', ShokuchouResultCertificatePDF.as_view(), name='download-shokuchou-certificate'),

    path('ojt-days-list/', OJTDayListView.as_view(), name="ojt-days-list"),
    path('ojt-topics-list/', OJTTopicListView.as_view(), name="ojt-topics-list"),
    path("trainee-info-list/", TraineeInfoListView.as_view(), name="trainee-info-list"),

    path('station-settings/', StationSettingCreateView.as_view(), name='station-setting-create'),



    path('start-test/', views.StartTestSessionView.as_view(), name='start_test_session'),
    path('api/end-test/', views.EndTestSessionView.as_view(), name='end_test_session'),
    path('api/scores/', views.ScoreListView.as_view(), name='score_list'),
    path('api/test-session/map/', views.KeyIdToEmployeeNameMap.as_view(), name='keyid-name-map'),
    path('api/past-sessions/', views.PastTestSessionsView.as_view()),
    path('api/scores-by-session/<str:name>/', views.ScoresByTestView.as_view()),
    path('api/score-summary/', views.ResultSummaryAPIView.as_view(), name='score-summary'),
    path('api/skills/', views.SkillListView.as_view(), name='skill-list'),
    path('api/scores-by-session/<path:name>/', views.ScoresByTestView.as_view()),
    path('submit-web-test/', SubmitWebTestAPIView.as_view(), name='submit-web-test'),
    path('api/key-events/create/', KeyEventCreateView.as_view()),
    path('api/key-events/latest/', LatestKeyEventView.as_view()),
    path('api/connect-events/create/', views.connect_event_create, name='connect_event_create'),
    path('api/vote-events/create/', views.vote_event_create, name='vote_event_create'),
    path('api/assessment-mode/', views.get_assessment_mode, name='get_assessment_mode'),
    path('api/assessment-mode/toggle/', views.toggle_assessment_mode, name='toggle_assessment_mode'),
    path('department/<int:department_id>/lines/', views.get_lines_by_department, name='lines-by-department'),
    path('line/<int:line_id>/sublines/', views.get_sublines_by_line, name='sublines-by-line'),
    path('subline/<int:subline_id>/stations/', views.get_stations_by_subline, name='stations-by-subline'),
    path('department/<int:department_id>/stations/', views.get_stations_by_department, name='stations-by-department'),
    path('line/<int:line_id>/stations/', views.get_stations_by_line, name='stations-by-line'),
    path('fetch-departments/', views.get_all_departments, name='fetch-departments'),


    path('api/notifications/count/', notification_count, name='notification-count'),
    path('api/notifications/system/', create_system_notification, name='create-system-notification'),
    path('api/notifications/test/', create_test_notification, name='create-test-notification'),
    path('api/notifications/debug/', test_notifications, name='test-notifications'),
    path('api/notifications/trigger-employee/', trigger_employee_notification, name='trigger-employee-notification'),
    path('api/notifications/trigger-all-types/', trigger_all_notification_types, name='trigger-all-notification-types'),
    path('api/notifications/delete-all/', delete_all_notifications, name='delete-all-notifications'),





    path('scores/passed/level-1/', LevelOnePassedUsersView.as_view(), name='passed-level-one-scores'),
    path("handovers/employee/<str:emp_id>/", EmployeeHandoverView.as_view()),
    path('fetch-departments/', views.get_all_departments, name='fetch-departments'),
    path("hierarchy/by-department/", HierarchyByDepartmentView.as_view(), name="hierarchy-by-department"),
    path('hierarchy-simple/', views.get_hierarchy_structures, name='get_hierarchy_structures'),



    path('production-plans/planning-data/', views.get_planning_data, name='planning-data'),
    path('trends/operators-required/', views.get_operators_required_trend, name='operators-required-trend'),
    path('production-data/gap-analysis/', views.monthly_availability_analysis, name='monthly_availability_analysis'),
    path('production-data/date-range-summary/', views.weekly_availability_summary, name='weekly_availability_summary'),


    path("hierarchy/all-departments/", HierarchyAllDepartmentsView.as_view(), name="hierarchy-all-departments"),


    path('api/usermanualdocs/', views.UserManualdocsListCreateView.as_view(), name='usermanualdocs-list-create'),
    path('api/usermanualdocs/<int:pk>/', views.UserManualdocsDetailView.as_view(), name='usermanualdocs-detail'),
    path('api/usermanualdocs/<int:doc_id>/view/', views.view_file, name='view-file'),
    path('api/usermanualdocs/<int:doc_id>/download/', views.download_file, name='download-file'),


    ## =================== TrainingAttendance ============================= #
    path('training-batches/active/', ActiveTrainingBatchListView.as_view(), name='active-training-batches'),
    path('training-batches/past/', PastTrainingBatchListView.as_view(), name='past-training-batches'),
    path('attendance-detail/<str:batch_id>/', BatchAttendanceDetailView.as_view(), name='batch-attendance-detail'),
    path('attendances/', BulkAttendanceUpdateView.as_view(), name='bulk-attendance-update'),
    path('batches/<str:batch_id>/complete/', CompleteTrainingBatchView.as_view(), name='complete-training-batch'), 
    # =================== TrainingAttendance End ============================= #




    path('current-month/training-data/', CurrentMonthTrainingDataView.as_view(), name='current-month-training-data'),
    path('current-month/defects-data/', CurrentMonthDefectsDataView.as_view(), name='current-month-defects-data'),
    path('chart/operators/', OperatorsChartView.as_view(), name='operators-chart'),
    path('chart/training-plans/', TrainingPlansChartView.as_view(), name='training-plans-chart'),
    path('chart/defects-msil/', DefectsChartView.as_view(), name='defects-msil-chart'),

    path('employee-card-details/', EmployeeCardDetailsView.as_view(), name='employee-card-details'),

    path("employee-skill-search/", EmployeeSkillSearch.as_view(), name="employee-skill-search"), 

    path('levels/<int:level_pk>/criteria/', EvaluationCriterionViewSet.as_view({'get': 'list'}), name='level-criteria'),
    # path('observancesheets/operator/<str:operator_name>/', get_sheet_by_operator, name='get-sheet-by-operator'),
    path('observancesheets/operator/<str:operator_name>/level/<str:level>/station/<str:station_name>/',
     get_sheet_by_operator_level_station, name='get-sheet-by-operator-level-station'),




    

  

    path('', include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)