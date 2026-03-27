import React, { useState, useEffect } from 'react';
import { 
  Camera,
  Filter,
  Search,
  Edit2,
  Save,
  X,
  RefreshCw
} from 'lucide-react';

const Mess = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMeal, setEditingMeal] = useState(null);
  const [editingTime, setEditingTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mealImages, setMealImages] = useState({
    breakfast: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    lunch: 'https://images.unsplash.com/photo-1680993032090-1ef7ea9b51e5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGtlcmFsYSUyMGx1bmNofGVufDB8fDB8fHww',
    dinner: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  });

  // API Base URL - Update this to match your backend URL
  const API_BASE_URL = 'http://localhost:8080/api/mess';

  // Skipped meal stats - will be populated from API
  const [skippedMealStats, setSkippedMealStats] = useState([
    { title: 'Skipped Breakfast', value: '0', bgColor: '#EF4444' },
    { title: 'Skipped Lunch', value: '0', bgColor: '#F59E0B' },
    { title: 'Skipped Dinner', value: '0', bgColor: '#10B981' }
  ]);

  // Meal data with food items - now editable with editable timing
  const [meals, setMeals] = useState([
    {
      id: 'breakfast',
      name: 'Breakfast',
      time: '7:00 AM - 9:00 AM',
      items: ['Idli (3 pieces)', 'Sambar', 'Coconut Chutney', 'Tea', 'Coffee'],
    },
    {
      id: 'lunch',
      name: 'Lunch', 
      time: '12:00 PM - 2:00 PM',
      items: ['Rice', 'Dal Tadka', 'Mixed Vegetable', 'Pickle', 'Buttermilk'],
    },
    {
      id: 'dinner',
      name: 'Dinner',
      time: '7:00 PM - 9:00 PM', 
      items: ['Chapati (3 pieces)', 'Rice', 'Paneer Curry', 'Dal', 'Salad'],
    }
  ]);

  // Student data - will be populated from API
  const [studentsData, setStudentsData] = useState([]);

  // Fetch skipped meal counts from backend
  const fetchSkippedCounts = async () => {
    try {
      const [breakfast, lunch, dinner] = await Promise.all([
        fetch(`${API_BASE_URL}/countSkipped/Breakfast`).then(res => res.json()),
        fetch(`${API_BASE_URL}/countSkipped/Lunch`).then(res => res.json()),
        fetch(`${API_BASE_URL}/countSkipped/Dinner`).then(res => res.json())
      ]);

      setSkippedMealStats([
        { title: 'Skipped Breakfast', value: breakfast.toString(), bgColor: '#EF4444' },
        { title: 'Skipped Lunch', value: lunch.toString(), bgColor: '#F59E0B' },
        { title: 'Skipped Dinner', value: dinner.toString(), bgColor: '#10B981' }
      ]);
    } catch (err) {
      console.error('Error fetching skipped counts:', err);
      // Keep default values on error
    }
  };

  // Fetch student data from backend
  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/skipped-students`);
      if (!response.ok) throw new Error('Failed to fetch student data');
      
      const data = await response.json();
      
      console.log('Raw backend data:', data); // Debug log
      
      // Transform backend data to match frontend structure
      // Backend returns: [name, mealSkipped, id, room, phone]
      const transformedData = data.map((item, index) => {
        console.log('Processing item:', item); // Debug log
        
        const mealsSkipped = [];
        const mealSkipped = item[1]; // "Breakfast", "Lunch", or "Dinner"
        if (mealSkipped) {
          mealsSkipped.push(mealSkipped);
        }

        const transformed = {
          id: item[2] || index + 1,
          studentName: item[0] || 'Unknown Student',
          breakfast: mealSkipped === 'Breakfast' ? 'No' : 'Yes',
          lunch: mealSkipped === 'Lunch' ? 'No' : 'Yes',
          dinner: mealSkipped === 'Dinner' ? 'No' : 'Yes',
          roomNoBlock: item[3] || 'N/A',
          phoneNo: item[4] || 'N/A',
          mealsSkipped
        };
        
        console.log('Transformed item:', transformed); // Debug log
        return transformed;
      });

      console.log('All transformed data:', transformedData); // Debug log
      setStudentsData(transformedData);
    } catch (err) {
      console.error('Error fetching student data:', err);
      // Keep empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchSkippedCounts();
    fetchStudentData();
  }, []);

  // Refresh data
  const handleRefresh = () => {
    fetchSkippedCounts();
    fetchStudentData();
  };

  const filteredStudents = studentsData.filter(student =>
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle file upload
  const handleFileUpload = (mealId, event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMealImages(prev => ({
          ...prev,
          [mealId]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = (mealId) => {
    document.getElementById(`file-input-${mealId}`).click();
  };

  // Handle edit meal items
  const handleEditMeal = (mealId) => {
    setEditingMeal(mealId);
  };

  // Handle save meal items
  const handleSaveMeal = (mealId, newItems) => {
    setMeals(prev => prev.map(meal => 
      meal.id === mealId 
        ? { ...meal, items: newItems }
        : meal
    ));
    setEditingMeal(null);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingMeal(null);
  };

  // Handle edit time
  const handleEditTime = (mealId) => {
    setEditingTime(mealId);
  };

  // Handle save time
  const handleSaveTime = (mealId, newTime) => {
    setMeals(prev => prev.map(meal => 
      meal.id === mealId 
        ? { ...meal, time: newTime }
        : meal
    ));
    setEditingTime(null);
  };

  // Handle cancel time edit
  const handleCancelTimeEdit = () => {
    setEditingTime(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Combined Skipped Stats and Meal Cards - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {meals.map((meal, index) => (
            <div key={meal.id} className="space-y-4">
              {/* Skipped Meal Stat - positioned above each meal card */}
              <div 
                className="rounded-xl p-6 shadow-lg relative overflow-hidden min-h-[120px] flex flex-col justify-between text-white transition-transform hover:scale-105"
                style={{ backgroundColor: skippedMealStats[index].bgColor }}
              >
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full"></div>
                <div className="absolute -right-8 -top-8 w-16 h-16 bg-white/5 rounded-full"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-white/80">{skippedMealStats[index].title}</h3>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold text-white">{skippedMealStats[index].value}</p>
                  </div>
                </div>
              </div>

              {/* Meal Card - positioned below the corresponding skipped stat */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">{meal.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    {editingTime === meal.id ? (
                      <EditableTime
                        time={meal.time}
                        onSave={(newTime) => handleSaveTime(meal.id, newTime)}
                        onCancel={handleCancelTimeEdit}
                      />
                    ) : (
                      <>
                        <p className="text-sm text-gray-500">{meal.time}</p>
                        <button
                          onClick={() => handleEditTime(meal.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Image Upload Area */}
                <div className="h-40 bg-gray-50 flex items-center justify-center border-b border-gray-200 relative">
                  <div className="relative w-full h-full">
                    <img 
                      src={mealImages[meal.id]} 
                      alt={meal.name} 
                      className="w-full h-full object-cover cursor-pointer" 
                      onClick={() => triggerFileInput(meal.id)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center cursor-pointer" onClick={() => triggerFileInput(meal.id)}>
                      <Camera className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                  
                  {/* Hidden file input */}
                  <input
                    id={`file-input-${meal.id}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(meal.id, e)}
                    className="hidden"
                  />
                </div>
                
                {/* Food Items List */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Menu Items:</h4>
                    {editingMeal !== meal.id && (
                      <button
                        onClick={() => handleEditMeal(meal.id)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="text-sm">Edit</span>
                      </button>
                    )}
                  </div>

                  {editingMeal === meal.id ? (
                    <EditableMenuItems
                      items={meal.items}
                      onSave={(newItems) => handleSaveMeal(meal.id, newItems)}
                      onCancel={handleCancelEdit}
                    />
                  ) : (
                    <ul className="space-y-2">
                      {meal.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Students Mess Management Table */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Student Mess Details</h2>
              <div className="flex items-center space-x-4">
                {/* Refresh Button */}
                <button 
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? 'Loading...' : 'Refresh'}</span>
                </button>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
                
              </div>
            </div>
          </div>  

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meals Skipped
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room No/Block
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone No
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      {loading ? 'Loading student data...' : 'No students found'}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-medium text-sm">
                              {student.studentName.charAt(0)}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {student.mealsSkipped.length === 0 ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              None
                            </span>
                          ) : (
                            student.mealsSkipped.map((meal, idx) => (
                              <span 
                                key={idx}
                                className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                              >
                                {meal}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.roomNoBlock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.phoneNo}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Editable Time Component
const EditableTime = ({ time, onSave, onCancel }) => {
  const [editableTime, setEditableTime] = useState(time);

  const handleSave = () => {
    onSave(editableTime);
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={editableTime}
        onChange={(e) => setEditableTime(e.target.value)}
        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-32"
        placeholder="e.g. 7:00 AM - 9:00 AM"
      />
      <button
        onClick={handleSave}
        className="text-green-600 hover:text-green-700"
      >
        <Save className="w-4 h-4" />
      </button>
      <button
        onClick={onCancel}
        className="text-gray-500 hover:text-gray-700"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Editable Menu Items Component
const EditableMenuItems = ({ items, onSave, onCancel }) => {
  const [editableItems, setEditableItems] = useState([...items]);

  const handleItemChange = (index, value) => {
    const newItems = [...editableItems];
    newItems[index] = value;
    setEditableItems(newItems);
  };

  const handleAddItem = () => {
    setEditableItems([...editableItems, '']);
  };

  const handleRemoveItem = (index) => {
    const newItems = editableItems.filter((_, i) => i !== index);
    setEditableItems(newItems);
  };

  const handleSave = () => {
    const filteredItems = editableItems.filter(item => item.trim() !== '');
    onSave(filteredItems);
  };

  return (
    <div className="space-y-3">
      {editableItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
          <input
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter menu item..."
          />
          <button
            onClick={() => handleRemoveItem(index)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      
      <button
        onClick={handleAddItem}
        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        + Add Item
      </button>
      
      <div className="flex items-center space-x-2 pt-2">
        <button
          onClick={handleSave}
          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span className="text-sm">Save</span>
        </button>
        <button
          onClick={onCancel}
          className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
          <span className="text-sm">Cancel</span>
        </button>
      </div>
    </div>
  );
};

export default Mess;