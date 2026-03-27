import { Card, CardHeader, CardTitle, CardContent } from "../../components/student/card";
import { Button } from "../../components/student/button";
import { Badge } from "../../components/student/badge";

interface Payment {
  id: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending";
}

const paymentsData: Payment[] = [
  { id: "1", amount: 500, date: "2025-09-20", status: "Paid" },
  { id: "2", amount: 300, date: "2025-09-18", status: "Pending" },
  { id: "3", amount: 1000, date: "2025-09-15", status: "Paid" },
];

const PaymentsTab = () => {
  return (
    <div className="space-y-6">
      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentsData.map((payment) => (
                  <tr key={payment.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{payment.id}</td>
                    <td className="px-4 py-2">₹{payment.amount}</td>
                    <td className="px-4 py-2">{payment.date}</td>
                    <td className="px-4 py-2">
                      <Badge
                        className={
                          payment.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Outstanding & Next Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Outstanding Dues</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl text-green-600 mb-2">₹0</div>
            <p className="text-sm text-gray-600">No pending payments</p>
            <Badge className="bg-green-100 text-green-800 mt-2">All Clear</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Payment Due</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-xl text-blue-600 mb-2">Aug 15, 2025</div>
            <p className="text-sm text-gray-600">Monthly Mess Fee</p>
            <p className="text-lg">₹5,000</p>
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
              Pay Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentsTab;
