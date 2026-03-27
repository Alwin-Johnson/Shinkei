// src/pages/student/AdmissionContinuation.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../../components/student/button';
import { Input } from '../../components/student/input';
import { Label } from '../../components/student/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/student/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/student/select';
import { toast } from 'sonner';
import { Check, CreditCard, Building, User, ArrowRight, ArrowLeft } from 'lucide-react';

interface AdmissionContinuationProps {
  onComplete?: () => void;
  studentId?: string;
}

interface PaymentData {
  method: string;
  amount: number;
}

interface RoomData {
  roomId?: number;
  roomNo?: string;
  floor?: string;
  type?: string;
  monthlyRent?: number;
  occupants?: Array<{ name: string; course: string; year: string }>;
  maxOccupancy?: number;
  block?: string;
  currentOccupancy?: number;
}

interface CredentialsData {
  studentId: string;
  password: string;
  confirmPassword: string;
}

export const AdmissionContinuation: React.FC<AdmissionContinuationProps> = ({ onComplete, studentId: propStudentId }) => {
  const [currentStep, setCurrentStep] = useState<number>(2);
  const [paymentData, setPaymentData] = useState<PaymentData>({ method: '', amount: 5000 });
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [roomFilter, setRoomFilter] = useState<string>('all');
  const [availableRooms, setAvailableRooms] = useState<RoomData[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState<boolean>(false);

  const [credentials, setCredentials] = useState<CredentialsData>({
    studentId: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    // Initialize studentId from props or from localStorage
    if (propStudentId) {
      setCredentials(prev => ({ ...prev, studentId: propStudentId }));
    } else {
      const storedId = localStorage.getItem('studentId');
      if (storedId) {
        setCredentials(prev => ({ ...prev, studentId: storedId }));
      }
    }
  }, [propStudentId]);

  // Fetch available rooms when reaching room selection step
  useEffect(() => {
    if (currentStep === 3) {
      fetchAvailableRooms();
    }
  }, [currentStep]);

  const fetchAvailableRooms = async (): Promise<void> => {
    setIsLoadingRooms(true);
    try {
      const response = await fetch('http://localhost:8080/api/rooms/available', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available rooms');
      }

      const data = await response.json();
      console.log('Fetched rooms raw data:', data);
      
      // Transform array of arrays to array of objects
      // Backend returns: [room_id, room_No, room_type, floor, monthly_rent, current_occupants]
      const transformedRooms: RoomData[] = data.map((room: any[]) => ({
        roomId: room[0],
        roomNo: room[1],
        type: room[2],
        floor: room[3],
        monthlyRent: room[4],
        currentOccupancy: room[5],
        maxOccupancy: getMaxOccupancyFromType(room[2]),
        occupants: []
      }));
      
      console.log('Transformed rooms:', transformedRooms);
      setAvailableRooms(transformedRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error(`Failed to load rooms: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setAvailableRooms([]);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  // Helper function to determine max occupancy from room type
  const getMaxOccupancyFromType = (type: string): number => {
    if (type.includes('Single')) return 1;
    if (type.includes('Double')) return 2;
    if (type.includes('Triple')) return 3;
    if (type.includes('Four')) return 4;
    return 1; // Default
  };

  const steps = [
    { number: 1, title: 'Application Submitted', completed: true },
    { number: 2, title: 'Payment', completed: currentStep > 2, active: currentStep === 2 },
    { number: 3, title: 'Room Selection', completed: currentStep > 3, active: currentStep === 3 },
    { number: 4, title: 'Account Setup', completed: currentStep > 4, active: currentStep === 4 }
  ];

  const validatePayment = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!paymentData.method) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRoomSelection = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedRoom || !selectedRoom.roomId) {
      newErrors.roomType = 'Please select a room';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCredentials = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(credentials.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!credentials.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (credentials.password !== credentials.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (): Promise<void> => {
    if (!validatePayment()) return;
    if (!credentials.studentId) {
      toast.error('Student ID is missing.');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:8080/api/students/register/admissionfee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: credentials.studentId })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'Payment update failed');
      }

      toast.success('Payment successful! Proceeding to room selection.');
      setCurrentStep(3);
    } catch (error) {
      toast.error(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRoomSelection = async (): Promise<void> => {
    if (!validateRoomSelection()) return;
    if (!credentials.studentId || !selectedRoom?.roomId) {
      toast.error('Student ID or room selection missing.');
      return;
    }

    setIsProcessing(true);
    try {
      // First, assign room to student
      const assignResponse = await fetch('http://localhost:8080/api/students/register/roomid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: credentials.studentId,
          roomId: selectedRoom.roomId
        })
      });

      if (!assignResponse.ok) {
        const err = await assignResponse.text();
        throw new Error(err || 'Room assignment failed');
      }

      // Then, update room login count
      const updateResponse = await fetch('http://localhost:8080/api/rooms/updateRoomLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoom.roomId
        })
      });

      if (!updateResponse.ok) {
        console.warn('Room login update failed, but room was assigned');
      }

      toast.success('Room allocated successfully!');
      setCurrentStep(4);

    } catch (error) {
      toast.error(`Room assignment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCredentialsSetup = async (): Promise<void> => {
    if (!validateCredentials()) return;
    if (!credentials.studentId) {
      toast.error('Student ID is missing.');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:8080/api/students/register/passwordsetting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: credentials.studentId,
          password: credentials.password
        })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'Password setup failed');
      }

      toast.success('Account created successfully! Redirecting to login...');
      setTimeout(() => onComplete && onComplete(), 2000);
    } catch (error) {
      toast.error(`Password setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const StepIndicator: React.FC = () => (
    <div className="flex items-center justify-center mb-8 px-4">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
              step.completed 
                ? 'bg-green-500 text-white' 
                : step.active 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step.completed ? <Check className="w-5 h-5" /> : step.number}
            </div>
            <span className={`mt-2 text-xs font-medium ${
              step.active ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-400'
            }`}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-px mx-4 ${
              step.completed ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const PaymentStep: React.FC = () => (
    <Card className="bg-white shadow-xl rounded-3xl">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Admission Fee Payment</CardTitle>
        <p className="text-gray-600">Complete your payment to secure your admission</p>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fee Details</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Admission Fee</span>
              <span className="text-2xl font-bold text-blue-600">₹5,000</span>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-800">Select Payment Method</Label>
            <Select onValueChange={(value) => setPaymentData({...paymentData, method: value})}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Choose payment method" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem value="upi" className="text-gray-900 hover:bg-gray-100">UPI Payment</SelectItem>
                <SelectItem value="card" className="text-gray-900 hover:bg-gray-100">Credit/Debit Card</SelectItem>
                <SelectItem value="netbanking" className="text-gray-900 hover:bg-gray-100">Net Banking</SelectItem>
              </SelectContent>
            </Select>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
            )}
          </div>

          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Pay ₹5,000</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const RoomSelectionStep: React.FC = () => {
    const filteredRooms = availableRooms.filter(room => 
      roomFilter === 'all' || room.type === roomFilter
    );

    return (
      <Card className="bg-white shadow-xl rounded-3xl">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Room Allocation</CardTitle>
          <p className="text-gray-600">Select your preferred room based on availability and details</p>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-6">
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Button 
                variant={roomFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setRoomFilter('all')}
                className="rounded-full"
              >
                All Rooms
              </Button>
              {['Single Room', 'Double Sharing', 'Triple Sharing', 'Four Sharing'].map(type => (
                <Button 
                  key={type}
                  variant={roomFilter === type ? 'default' : 'outline'}
                  onClick={() => setRoomFilter(type)}
                  className="rounded-full text-sm"
                >
                  {type}
                </Button>
              ))}
            </div>

            {isLoadingRooms ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-gray-600">Loading available rooms...</span>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-12">
                <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium">
                  {availableRooms.length === 0 
                    ? 'No rooms available at the moment.' 
                    : `No ${roomFilter} available.`}
                </p>
                <p className="text-gray-500 text-sm mt-2">Please try a different filter or check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <div
                    key={room.roomId}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedRoom?.roomId === room.roomId
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          Room {room.roomNo || 'N/A'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {room.floor || 'N/A'}
                        </p>
                      </div>
                      {selectedRoom?.roomId === room.roomId && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="text-lg font-semibold text-blue-600">
                        {room.type || 'N/A'}
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        ₹{room.monthlyRent || 0}/month
                      </p>
                    </div>

                    <div className="border-t pt-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Occupancy: {room.currentOccupancy || 0}/{room.maxOccupancy || 0}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${((room.currentOccupancy || 0) / (room.maxOccupancy || 1)) * 100}%` 
                          }}
                        />
                      </div>
                      {room.occupants && room.occupants.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-semibold text-gray-600">Current Occupants:</p>
                          {room.occupants.map((occupant, index) => (
                            <div key={index} className="text-xs bg-gray-100 p-2 rounded">
                              <p className="font-medium">{occupant.name}</p>
                              <p className="text-gray-600">{occupant.course} • {occupant.year}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {errors.roomType && (
              <p className="text-red-500 text-sm text-center">{errors.roomType}</p>
            )}

            <div className="flex space-x-4">
              <Button
                onClick={() => setCurrentStep(2)}
                variant="outline"
                className="flex-1 h-12 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleRoomSelection}
                disabled={isProcessing || !selectedRoom}
                className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Allocating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Building className="w-5 h-5" />
                    <span>Confirm Room {selectedRoom?.roomNo || 'Selection'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CredentialsStep: React.FC = () => (
    <Card className="bg-white shadow-xl rounded-3xl">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Account Setup</CardTitle>
        <p className="text-gray-600">Set up your student portal credentials</p>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Student ID</h3>
            <div className="text-2xl font-mono font-bold text-blue-600">{credentials.studentId}</div>
            <p className="text-sm text-gray-600 mt-2">Use this ID to login to your student portal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Create Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password (min 8 characters)"
                value={credentials.password}
                onChange={(e) => {
                  setCredentials(prev => ({...prev, password: e.target.value}));
                  if (errors.password) {
                    setErrors(prev => ({...prev, password: ''}));
                  }
                }}
                className={`h-12 rounded-xl transition-all duration-300 hover:shadow-lg focus:scale-105 ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                required
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={credentials.confirmPassword}
                onChange={(e) => {
                  setCredentials(prev => ({...prev, confirmPassword: e.target.value}));
                  if (errors.confirmPassword) {
                    setErrors(prev => ({...prev, confirmPassword: ''}));
                  }
                }}
                className={`h-12 rounded-xl transition-all duration-300 hover:shadow-lg focus:scale-105 ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                required
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={() => setCurrentStep(3)}
              variant="outline"
              className="flex-1 h-12 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleCredentialsSetup}
              disabled={isProcessing}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Complete Setup</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <style>
        {`
          .animate-slide-in {
            animation: slideIn 0.8s ease-out forwards;
          }
          
          @keyframes slideIn {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>

      <div className="max-w-4xl mx-auto px-6 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Complete Your Admission</h1>
          <p className="text-center text-gray-600">Follow the steps below to finalize your hostel admission</p>
        </div>
        
        <StepIndicator />
        
        <div className="animate-slide-in">
          {currentStep === 2 && <PaymentStep />}
          {currentStep === 3 && <RoomSelectionStep />}
          {currentStep === 4 && <CredentialsStep />}
        </div>
      </div>
    </>
  );
};