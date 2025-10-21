import React, { useState, useEffect } from 'react';
import type { OrientationFeedbackModalProps } from '../../constants/types';
import { API_ENDPOINTS } from '../../constants/api';
import { ModalHeader } from '../../molecules/ModalHeader/ModalHeader';
import { UserInfoSection } from '../../molecules/UserInfoSection/UserInfoSection';
import { OrientationForm } from '../../molecules/OrientationForm/OrientationForm';
import { ModalFooter } from '../../molecules/ModalFooter/ModalFooter';

export const OrientationFeedbackModal: React.FC<OrientationFeedbackModalProps> = ({
  user,
  onClose,
  onSave
}) => {
  const [orientationFields, setOrientationFields] = useState({
    emp_id: '',
    department: '',
    date_of_joining: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setOrientationFields({
      emp_id: '',
      department: '',
      date_of_joining: '',
    });
    setError(undefined);
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    setError(undefined);

    // Combine user data with orientation form data to match MasterTable model
    const orientationData = {
      emp_id: orientationFields.emp_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone_number,
      sex: user.sex,
      department: orientationFields.department,
      date_of_joining: orientationFields.date_of_joining,
      aadhar_number: user.aadharNumber, // Added from new response
      employment_type: user.employment_type, // Added from new response
      has_experience: user.hasExperience, // Added from new response
      experience_years: user.experienceYears, // Added from new response
      company_of_experience: user.companyOfExperience, // Added from new response
    };
    try {
      // Step 1: Save to operators-master table
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.EMPLOYEES}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orientationData),
      });

      if (response.ok) {
        // Step 2: Mark user as added to master
        await fetch(`${API_ENDPOINTS.BASE_URL}/user-body-checks/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ temp_id: user.temp_id })
        });

        alert('✅ Orientation feedback saved successfully!');
        onSave(); // This should trigger data refresh in parent component
      } else {
        const errorData = await response.json();
        setError(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      setError(`Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 hover:scale-100">

        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
          <ModalHeader user={user} onClose={onClose} />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <UserInfoSection user={user} />

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <OrientationForm
              orientationFields={orientationFields}
              setOrientationFields={setOrientationFields}
              error={error}
            />
          </div>
        </div>

        {/* Footer with gradient buttons */}
        <div className="border-t bg-gray-50 rounded-b-2xl px-6 py-4">
          <ModalFooter
            onClose={onClose}
            onSave={handleSave}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default OrientationFeedbackModal;