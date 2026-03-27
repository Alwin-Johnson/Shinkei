import { Card, CardHeader, CardTitle, CardContent } from '../../components/student/card';
import { User, Home, Users, Phone, Mail, Bed, Calendar, BookOpen, UserCircle, MapPinned } from 'lucide-react';

export function OverviewTab() {
  const studentData = {
    name: 'Amit Sharma',
    rollNumber: 'H20201',
    phone: '+91 9876543210',
    email: 'amit.sharma@college.edu',
    dateOfBirth: '15/08/2002',
    gender: 'Male',
    course: 'B.Tech',
    stream: 'CSE',
    year: '3rd Year',
    admissionNumber: 'ADM2020145',
    room: 'A-101',
    capacity: 4,
    roomType: 'Shared (4 Bed)',
    messType: 'Vegetarian',
    roommates: ['Priya Singh', 'Rajesh Kumar'],
    parentName: 'Rajesh Sharma',
    parentPhone: '+91 9876543211',
    guardianName: 'Vikram Kumar',
    guardianPhone: '+91 9876543212',
    address: '123, Green Valley Apartments, MG Road, Bangalore, Karnataka - 560001',
  };

  const occupiedBeds = studentData.roommates.length + 1;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Hero Section: Student Profile & Room Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Profile Card */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden h-full">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 mb-6">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-4 sm:mb-0">
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Student Profile</p>
                  <h2 className="text-2xl md:text-3xl font-bold">{studentData.name}</h2>
                  <p className="text-blue-200 text-base md:text-lg mt-1">{studentData.rollNumber}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20 hover:bg-opacity-20 transition-all">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-100 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-blue-100 text-xs font-medium">Phone Number</p>
                      <p className="font-semibold text-sm md:text-base">{studentData.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20 hover:bg-opacity-20 transition-all">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-100 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-blue-100 text-xs font-medium">Email Address</p>
                      <p className="font-semibold text-sm truncate">{studentData.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Card with Roommates */}
        <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <Home className="w-32 h-32" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-4">
                <Home className="w-8 h-8" />
              </div>
              <p className="text-green-100 text-sm font-medium mb-2">Your Room</p>
              <p className="text-4xl md:text-5xl font-bold mb-4">{studentData.room}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-green-100">
                <Bed className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{occupiedBeds}/{studentData.capacity} Beds Occupied</span>
              </div>
              
              {/* Roommates List */}
              {studentData.roommates.length > 0 && (
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-3 border border-white border-opacity-20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-green-100 flex-shrink-0" />
                    <p className="text-xs font-medium text-green-100">Roommates ({studentData.roommates.length})</p>
                  </div>
                  <div className="space-y-1.5">
                    {studentData.roommates.map((roommate, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-3 h-3" />
                        </div>
                        <p className="text-sm font-medium truncate">{roommate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md border-gray-200">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-5">
            {/* Two-column layout inside card */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Date of Birth</p>
                    <p className="text-sm font-semibold text-gray-800">{studentData.dateOfBirth}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <UserCircle className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Gender</p>
                    <p className="text-sm font-semibold text-gray-800">{studentData.gender}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Admission Number</p>
                    <p className="text-sm font-semibold text-gray-800">{studentData.admissionNumber}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPinned className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Permanent Address</p>
                    <p className="text-sm font-semibold text-gray-800">{studentData.address}</p>
                  </div>
                </div>
              </div>

              {/* Right: Parent & Guardian */}
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-2">Parent / Guardian</p>
                  <div className="flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-gray-600" />
                    <p className="text-sm font-semibold text-gray-800">{studentData.parentName}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone className="w-3.5 h-3.5 text-gray-600" />
                    <p className="text-sm text-gray-700">{studentData.parentPhone}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 font-medium mb-2">Local Guardian</p>
                  <div className="flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-gray-600" />
                    <p className="text-sm font-semibold text-gray-800">{studentData.guardianName}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone className="w-3.5 h-3.5 text-gray-600" />
                    <p className="text-sm text-gray-700">{studentData.guardianPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Academic Information */}
        <Card className="shadow-md border-gray-200">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-base md:text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span>Academic Information</span>
            </CardTitle>
          </CardHeader>
                    
          <CardContent className="p-4">
            <div className="space-y-1.5">
              {/* Course */}
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Course</p>
                <p className="text-sm font-semibold text-gray-800">{studentData.course}</p>
              </div>

              {/* Current Year moved just below Course */}
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Current Year</p>
                <p className="text-sm font-semibold text-gray-800">{studentData.year}</p>
              </div>

              {/* Stream */}
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Stream</p>
                <p className="text-sm font-semibold text-gray-800">{studentData.stream}</p>
              </div>

              {/* Room Type */}
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Room Type</p>
                <p className="text-sm font-semibold text-gray-800">{studentData.roomType}</p>
              </div>
            </div>
          </CardContent>
        </Card>
                    
      </div>
    </div>
  );
}