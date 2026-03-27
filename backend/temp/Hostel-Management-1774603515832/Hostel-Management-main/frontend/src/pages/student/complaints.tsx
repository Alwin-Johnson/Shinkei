import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/student/card';
import { Badge } from '../../components/student/badge';
import { Input } from '../../components/student/input';
import { Textarea } from '../../components/student/textarea';
import { Label } from '../../components/student/label';
import { Button } from '../../components/student/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../components/student/select';
import { toast } from 'sonner';

export function StudentComplaints() {
  const [complaint, setComplaint] = useState({ category: '', subject: '', description: '' });
  const [complaintsList, setComplaintsList] = useState([
    { id: 'CM2024001', title: 'Room AC not working', status: 'In Progress', date: '2024-07-20', color: 'yellow' },
    { id: 'CM2024002', title: 'Mess food quality', status: 'Resolved', date: '2024-07-15', color: 'green' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (complaint.category && complaint.subject && complaint.description) {
      const newComplaint = {
        id: `CM${Math.floor(Math.random() * 1000000)}`,
        title: complaint.subject,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        color: 'blue'
      };
      setComplaintsList([newComplaint, ...complaintsList]);
      toast.success('Complaint registered successfully!');
      setComplaint({ category: '', subject: '', description: '' });
    } else toast.error('Please fill all fields');
  };

  return (
    <div className="space-y-6">

      {/* Register Complaint Card */}
      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center space-x-2">
            <span>Register New Complaint</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="category">Complaint Category</Label>
              <Select onValueChange={(value) => setComplaint({ ...complaint, category: value })}>
                <SelectTrigger className="rounded-xl border-blue-200 bg-white hover:border-blue-300">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg bg-white">
                  {['Room Maintenance','Mess Related','Electrical Issues','Plumbing Issues','Cleanliness','Security','Other'].map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase().replace(' ', '-')}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Brief description of the issue"
                value={complaint.subject}
                onChange={(e) => setComplaint({ ...complaint, subject: e.target.value })}
                className="rounded-xl border-blue-200 hover:border-blue-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about the complaint"
                value={complaint.description}
                onChange={(e) => setComplaint({ ...complaint, description: e.target.value })}
                rows={4}
                className="rounded-xl border-blue-200 hover:border-blue-300"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg transition-all duration-300"
            >
              Submit Complaint
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Complaints Card */}
      <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center space-x-2">
            <span>Recent Complaints</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {complaintsList.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col space-y-1"
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium">{item.title}</h4>
                <Badge className={`bg-${item.color}-100 text-${item.color}-800 animate-pulse`}>{item.status}</Badge>
              </div>
              <p className="text-xs text-gray-500">
                Tracking ID: {item.id} • Submitted: {item.date}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
