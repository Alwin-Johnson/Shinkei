// src/pages/student/NewAdmission.tsx
import React, { useState } from 'react';
import { Button } from '../../components/student/button';
import { Input } from '../../components/student/input';
import { Label } from '../../components/student/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/student/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/student/select';
import { Textarea } from '../../components/student/textarea';
import { toast } from 'sonner';

interface NewAdmissionProps {
  onPageChange?: (page: string) => void;
  setStudentId?: (id: number) => void;
}

export const NewAdmission: React.FC<NewAdmissionProps> = ({ onPageChange, setStudentId }) => {
  const [applicationData, setApplicationData] = useState({
    name: '', email: '', phone: '', dateOfBirth: '', gender: '', course: '', stream: '', year: '',
    collegeAdmissionNo: '', parentName: '', parentPhone: '', guardianName: '', guardianPhone: '',
    address: '', roomPreference: '', messType: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ===== Validation Functions =====
  const validateName = (name: string): string => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!name.trim()) return 'This field is required';
    if (!nameRegex.test(name)) return 'Should contain only alphabets';
    if (name.trim().length < 2) return 'Should be at least 2 characters';
    return '';
  };

  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone: string): string => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.trim()) return 'Phone number is required';
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) return 'Phone number must be exactly 10 digits';
    return '';
  };

  const validateRequired = (value: string, fieldName: string): string => {
    if (!value || !value.trim()) return `${fieldName} is required`;
    return '';
  };

  const validateAddress = (address: string): string => {
    if (!address.trim()) return 'Address is required';
    if (address.trim().length < 10) return 'Address should be at least 10 characters';
    return '';
  };

  const validateCollegeNo = (collegeNo: string): string => {
    if (!collegeNo.trim()) return 'College admission number is required';
    if (!/^[a-zA-Z0-9]+$/.test(collegeNo)) return 'Should contain only letters and numbers';
    return '';
  };

  const validateDateOfBirth = (date: string): string => {
    if (!date.trim()) return 'Date of birth is required';
    const selectedDate = new Date(date);
    const today = new Date();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    let age = today.getFullYear() - selectedDate.getFullYear();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
      age--;
    }
    if (age < 15 || age > 30) return 'Age should be between 15-30 years';
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    newErrors.name = validateName(applicationData.name);
    newErrors.email = validateEmail(applicationData.email);
    newErrors.phone = validatePhone(applicationData.phone);
    newErrors.dateOfBirth = validateDateOfBirth(applicationData.dateOfBirth);
    newErrors.gender = validateRequired(applicationData.gender, 'Gender');
    newErrors.course = validateRequired(applicationData.course, 'Course');
    newErrors.stream = validateRequired(applicationData.stream, 'Stream');
    newErrors.year = validateRequired(applicationData.year, 'Academic Year');
    newErrors.collegeAdmissionNo = validateCollegeNo(applicationData.collegeAdmissionNo);
    newErrors.parentName = validateName(applicationData.parentName);
    newErrors.parentPhone = validatePhone(applicationData.parentPhone);
    newErrors.guardianName = validateName(applicationData.guardianName);
    newErrors.guardianPhone = validatePhone(applicationData.guardianPhone);
    newErrors.address = validateAddress(applicationData.address);
    newErrors.roomPreference = validateRequired(applicationData.roomPreference, 'Room Preference');
    newErrors.messType = validateRequired(applicationData.messType, 'Mess Type');

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  // ===== Input Handling =====
  const handleInputChange = (field: string, value: string): void => {
    setApplicationData({ ...applicationData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const getYearText = (year: string): string => {
    const yearMap: { [key: string]: string } = { '1': 'First', '2': 'Second', '3': 'Third', '4': 'Fourth' };
    return yearMap[year] || year;
  };

  // ===== Registration Submission Logic =====
  const handleApplicationSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setIsSubmitting(true);
    try {
      const requestBody = {
        collegeId: applicationData.collegeAdmissionNo,
        name: applicationData.name,
        gender: applicationData.gender.charAt(0).toUpperCase() + applicationData.gender.slice(1),
        dob: applicationData.dateOfBirth,
        course: applicationData.course === 'btech' ? 'BTech' : 'MTech',
        stream: applicationData.stream.toUpperCase(),
        year: getYearText(applicationData.year),
        email: applicationData.email,
        contactNo: applicationData.phone,
        address: applicationData.address,
        guardianName: applicationData.guardianName,
        guardianContact: applicationData.guardianPhone,
        parentName: applicationData.parentName,
        parentContact: applicationData.parentPhone
      };

      const response = await fetch('http://localhost:8080/api/students/register/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);

      if (data.studentId) {
        setStudentId && setStudentId(data.studentId); // <-- store in parent/global
        localStorage.setItem('studentId', data.studentId.toString()); // <-- enables use after reload
      }

      toast.success('Application submitted successfully! We will inform you soon about your status.');
      setApplicationData({
        name: '', email: '', phone: '', dateOfBirth: '', gender: '', course: '', stream: '', year: '',
        collegeAdmissionNo: '', parentName: '', parentPhone: '', guardianName: '', guardianPhone: '',
        address: '', roomPreference: '', messType: ''
      });

      setTimeout(() => onPageChange && onPageChange('continuation'), 1500);

    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(`Failed to submit application: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string): string =>
    `h-12 rounded-xl transition-all duration-300 hover:shadow-lg focus:scale-105 ${errors[field] ? 'border-red-500 focus:ring-red-500' : ''}`;
  
  const ErrorText: React.FC<{ field: string }> = ({ field }) =>
    errors[field] ? <p className="text-red-500 text-sm mt-1">{errors[field]}</p> : null;

  // ===== Render Form =====
  

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5); }
          }
          .animate-slide-in { animation: slideIn 0.8s ease-out forwards; }
          .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        `}
      </style>

      <div className="max-w-4xl mx-auto px-6 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Card className="bg-white shadow-xl rounded-3xl animate-slide-in relative z-10">
          
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-gray-900">New Admission Application</CardTitle>
            <p className="text-gray-600 text-lg">Fill out the form below to apply for hostel admission</p>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleApplicationSubmit} className="space-y-6">

              {/* Personal Information */}
              <div className="space-y-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center border-b pb-3">
                  <div className="w-2 h-6 bg-blue-600 rounded mr-2 animate-pulse-glow"></div>
                  <h4 className="text-xl font-semibold text-gray-800">Personal Information</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name" type="text" placeholder="Enter full name"
                      value={applicationData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={inputClass('name')} required
                    />
                    <ErrorText field="name" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email" type="email" placeholder="student@example.com"
                      value={applicationData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={inputClass('email')} required
                    />
                    <ErrorText field="email" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone" type="tel" placeholder="9876543210" maxLength={10}
                      value={applicationData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        handleInputChange('phone', value);
                      }}
                      className={inputClass('phone')} required
                    />
                    <ErrorText field="phone" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="dob">Date of Birth *</Label>
                    <Input
                      id="dob" type="date"
                      value={applicationData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className={inputClass('dateOfBirth')} required
                    />
                    <ErrorText field="dateOfBirth" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger className={inputClass('gender')}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="male" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Male</SelectItem>
                        <SelectItem value="female" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Female</SelectItem>
                        <SelectItem value="other" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorText field="gender" />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4 animate-slide-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center border-b pb-3">
                  <div className="w-2 h-6 bg-green-600 rounded mr-2 animate-pulse-glow"></div>
                  <h4 className="text-xl font-semibold text-gray-800">Academic Information</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="course">Course *</Label>
                    <Select onValueChange={(value) => handleInputChange('course', value)}>
                      <SelectTrigger className={inputClass('course')}>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="btech" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">B.Tech</SelectItem>
                        <SelectItem value="mtech" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">M.Tech</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorText field="course" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="stream">Stream *</Label>
                    <Select onValueChange={(value) => handleInputChange('stream', value)}>
                      <SelectTrigger className={inputClass('stream')}>
                        <SelectValue placeholder="Select stream" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="cse" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">CSE</SelectItem>
                        <SelectItem value="ece" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">ECE</SelectItem>
                        <SelectItem value="mechanical" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Mechanical</SelectItem>
                        <SelectItem value="civil" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Civil</SelectItem>
                        <SelectItem value="electrical" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorText field="stream" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="year">Academic Year *</Label>
                    <Select onValueChange={(value) => handleInputChange('year', value)}>
                      <SelectTrigger className={inputClass('year')}>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="1" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">First Year</SelectItem>
                        <SelectItem value="2" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Second Year</SelectItem>
                        <SelectItem value="3" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Third Year</SelectItem>
                        <SelectItem value="4" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Fourth Year</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorText field="year" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="collegeAdmissionNo">College Admission No *</Label>
                    <Input
                      id="collegeAdmissionNo" type="text" placeholder="Enter college admission no"
                      value={applicationData.collegeAdmissionNo}
                      onChange={(e) => handleInputChange('collegeAdmissionNo', e.target.value)}
                      className={inputClass('collegeAdmissionNo')} required
                    />
                    <ErrorText field="collegeAdmissionNo" />
                  </div>
                </div>
              </div>

              {/* Family Information */}
              <div className="space-y-4 animate-slide-in" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center border-b pb-3">
                  <div className="w-2 h-6 bg-purple-600 rounded mr-2 animate-pulse-glow"></div>
                  <h4 className="text-xl font-semibold text-gray-800">Family Information</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="parentName">Parent Name *</Label>
                    <Input
                      id="parentName" type="text" placeholder="Enter parent name"
                      value={applicationData.parentName}
                      onChange={(e) => handleInputChange('parentName', e.target.value)}
                      className={inputClass('parentName')} required
                    />
                    <ErrorText field="parentName" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="parentPhone">Parent Phone *</Label>
                    <Input
                      id="parentPhone" type="tel" placeholder="9876543210" maxLength={10}
                      value={applicationData.parentPhone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        handleInputChange('parentPhone', value);
                      }}
                      className={inputClass('parentPhone')} required
                    />
                    <ErrorText field="parentPhone" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="guardianName">Local Guardian Name *</Label>
                    <Input
                      id="guardianName" type="text" placeholder="Enter local guardian name"
                      value={applicationData.guardianName}
                      onChange={(e) => handleInputChange('guardianName', e.target.value)}
                      className={inputClass('guardianName')} required
                    />
                    <ErrorText field="guardianName" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="guardianPhone">Local Guardian Phone *</Label>
                    <Input
                      id="guardianPhone" type="tel" placeholder="9876543210" maxLength={10}
                      value={applicationData.guardianPhone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        handleInputChange('guardianPhone', value);
                      }}
                      className={inputClass('guardianPhone')} required
                    />
                    <ErrorText field="guardianPhone" />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4 animate-slide-in" style={{ animationDelay: '0.8s' }}>
                <div className="flex items-center border-b pb-3">
                  <div className="w-2 h-6 bg-orange-600 rounded mr-2 animate-pulse-glow"></div>
                  <h4 className="text-xl font-semibold text-gray-800">Address</h4>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea
                    id="address" placeholder="Enter full address (minimum 10 characters)"
                    value={applicationData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`rounded-xl transition-all duration-300 hover:shadow-lg focus:scale-105 ${
                      errors.address ? 'border-red-500 focus:ring-red-500' : ''
                    }`} required
                  />
                  <ErrorText field="address" />
                </div>
              </div>

              {/* Hostel Preferences */}
              <div className="space-y-4 animate-slide-in" style={{ animationDelay: '1s' }}>
                <div className="flex items-center border-b pb-3">
                  <div className="w-2 h-6 bg-teal-600 rounded mr-2 animate-pulse-glow"></div>
                  <h4 className="text-xl font-semibold text-gray-800">Hostel Preferences</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="roomPreference">Room Preference *</Label>
                    <Select onValueChange={(value) => handleInputChange('roomPreference', value)}>
                      <SelectTrigger className={inputClass('roomPreference')}>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="single" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Single Room</SelectItem>
                        <SelectItem value="double" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Double Sharing</SelectItem>
                        <SelectItem value="triple" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Triple Sharing</SelectItem>
                        <SelectItem value="four" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Four Sharing</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorText field="roomPreference" />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="messType">Mess Type Preference *</Label>
                    <Select onValueChange={(value) => handleInputChange('messType', value)}>
                      <SelectTrigger className={inputClass('messType')}>
                        <SelectValue placeholder="Select mess type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="veg" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Vegetarian</SelectItem>
                        <SelectItem value="nonveg" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Non-Vegetarian</SelectItem>
                        <SelectItem value="mixed" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorText field="messType" />
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4 animate-slide-in" style={{ animationDelay: '1.2s' }}>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full max-w-md h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
