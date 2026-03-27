import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/student/card';
import { Clock, Utensils, Scissors, Plus, CalendarX } from 'lucide-react';
import { Button } from '../../components/student/button';
import { Badge } from '../../components/student/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/student/dialog';
import { Input } from '../../components/student/input';
import { Textarea } from '../../components/student/textarea';
import { Label } from '../../components/student/label';

export function StudentMess() {
  const [messCut, setMessCut] = useState({ startDate: '', endDate: '', reason: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const messTimings = {
    breakfast: '7:30 AM - 9:00 AM',
    lunch: '12:30 PM - 2:00 PM',
    dinner: '7:00 PM - 8:30 PM'
  };

  const calculateDaysBetween = (start: string, end: string) => {
    if (!start || !end) return 0;
    return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24)) + 1;
  };

  return (
    <div className="space-y-6">

      {/* Mess Details Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Meal Timings */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center space-x-2 text-gray-800">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold">Meal Timings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(messTimings).map(([meal, time]) => {
              const colors = {
                breakfast: 'bg-orange-50 border-orange-100 text-orange-700',
                lunch: 'bg-blue-50 border-blue-100 text-blue-700',
                dinner: 'bg-purple-50 border-purple-100 text-purple-700'
              };
              return (
                <div key={meal} className={`flex items-center justify-between p-3 rounded-lg border ${colors[meal as keyof typeof colors]}`}>
                  <span className="font-medium capitalize text-gray-700">{meal}</span>
                  <span className="font-semibold text-gray-900">{time}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Meal Options */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center space-x-2 text-gray-800">
              <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                <Utensils className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold">Meal Options</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">

            {/* Vegetarian & Non-Vegetarian Menus */}
            {[
              { type: 'Vegetarian Menu', desc: 'Traditional vegetarian meals with variety of regional cuisines', color: 'green' },
              { type: 'Non-Vegetarian Menu', desc: 'Includes chicken, fish and egg preparations along with veg options', color: 'red' }
            ].map((menu, idx) => (
              <div key={idx} className={`p-3 border rounded-lg ${menu.color === 'green' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${menu.color === 'green' ? 'text-green-800' : 'text-red-800'}`}>{menu.type}</h4>
                  <Badge className={`${menu.color === 'green' ? 'bg-green-500' : 'bg-red-500'} text-white text-xs`}>Available</Badge>
                </div>
                <p className="text-sm text-gray-600">{menu.desc}</p>
              </div>
            ))}

            {/* Current Subscription */}
            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800 mb-1">Current Subscription</h4>
              <p className="font-medium text-gray-900">Mixed Plan - ₹5,000/month</p>
              <p className="text-xs text-gray-600 mt-1">Includes all meal options</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mess Cut Section */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-800">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <Scissors className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold">Mess Cut Requests</span>
            </div>

            {/* Request Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-colors">
                  <Plus className="w-4 h-4 mr-2" /> Request Mess Cut
                </Button>
              </DialogTrigger>

              {/* Dialog Content */}
              <DialogContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2 text-gray-800">
                    <CalendarX className="w-5 h-5" />
                    <span>Request Mess Cut</span>
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-2">
                    Minimum 3 consecutive days required for mess cut
                  </p>
                </DialogHeader>

                <form className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-gray-700">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={messCut.startDate}
                        onChange={(e) => setMessCut({ ...messCut, startDate: e.target.value })}
                        className="rounded-lg border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-gray-700">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={messCut.endDate}
                        onChange={(e) => setMessCut({ ...messCut, endDate: e.target.value })}
                        className="rounded-lg border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-gray-700">Reason</Label>
                    <Textarea
                      id="reason"
                      placeholder="Reason for mess cut"
                      value={messCut.reason}
                      onChange={(e) => setMessCut({ ...messCut, reason: e.target.value })}
                      rows={3}
                      className="rounded-lg border-gray-300"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 rounded-lg shadow-sm transition-colors"
                    disabled={!messCut.startDate || !messCut.endDate || calculateDaysBetween(messCut.startDate, messCut.endDate) < 3}
                  >
                    <CalendarX className="w-4 h-4 mr-2" />
                    Submit Mess Cut Request
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Previous Mess Cut Entries */}
          {[
            { title: 'Vacation Leave', status: 'Approved', color: 'yellow', start: 'Dec 20, 2024', end: 'Jan 5, 2025', savings: 3200 },
            { title: 'Family Visit', status: 'Completed', color: 'green', start: 'Nov 15, 2024', end: 'Nov 18, 2024', savings: 800 }
          ].map((entry, idx) => (
            <div key={idx} className={`p-3 border rounded-lg ${entry.color === 'yellow' ? 'bg-yellow-50 border-yellow-100' : 'bg-green-50 border-green-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-medium ${entry.color === 'yellow' ? 'text-yellow-800' : 'text-green-800'}`}>{entry.title}</h4>
                <Badge className={`${entry.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'} text-white text-xs`}>{entry.status}</Badge>
              </div>
              <p className="text-sm text-gray-600">{entry.start} - {entry.end} ({calculateDaysBetween(entry.start, entry.end)} days)</p>
              <p className="text-xs text-gray-500 mt-1">Savings: ₹{entry.savings}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}