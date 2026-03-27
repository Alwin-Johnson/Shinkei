import { useState, useEffect } from 'react';

export default function HostelManagement() {
  const [complaints, setComplaints] = useState<any[]>([]);

  // Sample complaints data
  useEffect(() => {
    const sampleComplaints = [
      {
        id: 1,
        studentName: "John Doe",
        roomNo: "A-101",
        type: "Room Issue",
        text: "The air conditioner in my room is not working properly. It makes loud noises and doesn't cool the room effectively.",
        date: "2025-09-20",
        status: "Pending"
      },
      {
        id: 2,
        studentName: "Sarah Wilson",
        roomNo: "B-205",
        type: "Cleaning",
        text: "The common washroom on the 2nd floor needs urgent cleaning. The drainage is blocked and there's water stagnation.",
        date: "2025-09-21",
        status: "Pending"
      },
      {
        id: 3,
        studentName: "Mike Johnson",
        roomNo: "C-304",
        type: "Food Quality",
        text: "The quality of food served in the mess has deteriorated. Today's dinner was undercooked and tasteless.",
        date: "2025-09-22",
        status: "Resolved"
      },
      {
        id: 4,
        studentName: "Emily Davis",
        roomNo: "A-108",
        type: "Room Issue",
        text: "The main door lock of my room is broken and doesn't close properly, which is a security concern.",
        date: "2025-09-23",
        status: "Pending"
      },
      {
        id: 5,
        studentName: "Alex Chen",
        roomNo: "B-112",
        type: "Food Quality",
        text: "The breakfast served today had stale bread and the milk was sour. Please improve the food quality control.",
        date: "2025-09-24",
        status: "Pending"
      },
      {
        id: 6,
        studentName: "Lisa Brown",
        roomNo: "C-201",
        type: "Cleaning",
        text: "The corridor on the 2nd floor hasn't been cleaned for days. There's dust everywhere and the floor is dirty.",
        date: "2025-09-24",
        status: "Pending"
      }
    ];

    setComplaints(sampleComplaints);
  }, []);


  const toggleComplaintStatus = (complaintId: number) => {
    const complaint = complaints.find(c => c.id === complaintId);
    const message = complaint.status === 'Pending' 
      ? 'Are you sure you want to mark this complaint as resolved?' 
      : 'Are you sure you want to mark this complaint as unresolved?';
    
    if (window.confirm(message)) {
      setComplaints(prevComplaints => 
        prevComplaints.map(c => 
          c.id === complaintId 
            ? { ...c, status: c.status === 'Resolved' ? 'Pending' : 'Resolved' }
            : c
        )
      );
      
      // Success message after status change
      const newStatus = complaint.status === 'Pending' ? 'resolved' : 'pending';
      alert(`Complaint has been marked as ${newStatus} successfully!`);
    }
  };

  // Group complaints by category
  const groupComplaintsByCategory = (): Record<string, any[]> => {
    const categories: Record<string, any[]> = {
      'Room Issue': [],
      'Food Quality': [],
      'Cleaning': []
    };
    
    complaints.forEach(complaint => {
      if (categories[complaint.type]) {
        categories[complaint.type].push(complaint);
      }
    });
    
    return categories;
  };

  const ComplaintCard = ({ complaint }: { complaint: any }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="font-semibold text-indigo-600 text-lg">
          {complaint.studentName} - Room {complaint.roomNo}
        </div>
        <div className="text-sm text-gray-500">
          {complaint.date}
        </div>
      </div>
      <div className="text-gray-700 mb-3 leading-relaxed">
        <strong className="text-gray-900">{complaint.type}:</strong> {complaint.text}
      </div>
      <div className="flex items-center justify-between">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          complaint.status === 'Resolved' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {complaint.status}
        </span>
        <button
          onClick={() => toggleComplaintStatus(complaint.id)}
          className={`px-4 py-2 text-white rounded-lg text-sm font-medium transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg ${
            complaint.status === 'Pending' 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          {complaint.status === 'Pending' ? 'Mark as Resolved' : 'Mark as Unresolved'}
        </button>
      </div>
    </div>
  );

  const CategorySection = ({ title, complaints }: { title: string, complaints: any[] }) => (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <span className="ml-3 bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {complaints.length}
        </span>
      </div>
      {complaints.length === 0 ? (
        <div className="text-center text-gray-500 py-6 bg-gray-50 rounded-lg">
          <p>No complaints in this category</p>
        </div>
      ) : (
        complaints.map(complaint => (
          <ComplaintCard key={complaint.id} complaint={complaint} />
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
        <div className="space-y-10">
          {Object.entries(groupComplaintsByCategory()).map(([category, categoryComplaints]) => (
            <CategorySection
              key={category}
              title={category}
              complaints={categoryComplaints}
            />
          ))}
        </div>
    </div>
  );
}