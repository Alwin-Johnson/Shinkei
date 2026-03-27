import { Button } from "../../components/admin/button";
import { Card, CardContent } from "../../components/admin/card";
import { Mail, Phone, MapPin, Users, Shield, ArrowRight, Star, Wifi, Car, Coffee, Heart} from 'lucide-react';
import { ImageWithFallback } from '../../assests/ImageWithFallback';
interface LandingPageProps {
  onPageChange: (target: 'admin' | 'student') => void;
}

export function LandingPage({ onPageChange }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <div></div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">Campus Hostel</h1>
                <p className="text-xs text-gray-500">Automation</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#facilities" className="text-gray-600 hover:text-blue-600 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-blue-50/50 font-medium">Facilities</a>
              <a href="#gallery" className="text-gray-600 hover:text-blue-600 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-blue-50/50 font-medium">Gallery</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-blue-50/50 font-medium">Contact</a>
      
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div className="space-y-8">
              <div className="space-y-6">
                
                <h2 className="text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 bg-clip-text text-transparent">
                    Your Dream
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Hostel Life
                  </span>
                </h2>
                <p className="text-xl text-gray-700 max-w-lg leading-relaxed">
                  Experience luxury living with world-class amenities, gourmet dining, 
                  and a vibrant community that feels like family.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <a href="#gallery" className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105">
                  <span>Explore Gallery</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#contact" className="group border-2 border-gray-300 hover:border-blue-300 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-2 bg-white/50 backdrop-blur-sm hover:bg-white/80">
                  <span>Contact Us</span>
                  <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </a>
              </div>
             </div>
            
            {/* Right content - Enhanced Portal Cards */}
            <div className="space-y-6">
              <Card
                className="group bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 backdrop-blur-sm"
                onClick={() => onPageChange('student')}
              >
                <CardContent className="p-8 relative overflow-hin">
                  
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Student Portal</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Access your personalized dashboard, track attendance, manage payments, and connect with our vibrant hostel community
                  </p>
                  <div className="flex items-center justify-between">
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg group-hover:shadow-xl transition-all">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                  </div>
                </CardContent>
              </Card>

              <Card
                className="group bg-gradient-to-br from-white to-indigo-50/50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 backdrop-blur-sm"
                onClick={() => onPageChange('admin')}
              >
                <CardContent className="p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Admin Portal</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Comprehensive management suite for student administration, fee collection, mess operations, and facility oversight
                  </p>
                  <div className="flex items-center justify-between">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg group-hover:shadow-xl transition-all">
                      Admin Access
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="facilities" className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need & More</h3>
            <p className="text-xl text-gray-600">Premium amenities designed for modern student living</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group bg-gradient-to-br from-white to-green-50/50 border-0 shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform">
                <Wifi className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Ultra-Fast WiFi</h4>
              <p className="text-gray-600 text-sm">1Gbps unlimited internet across all areas</p>
              <div className="mt-4 flex items-center justify-center text-xs text-green-600 font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Always Connected
              </div>
            </Card>

            <Card className="group bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform">
                <Car className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Secure Parking</h4>
              <p className="text-gray-600 text-sm">24/7 monitored parking for bikes & cars</p>
              <div className="mt-4 flex items-center justify-center text-xs text-blue-600 font-medium">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                200+ Slots
              </div>
            </Card>

            <Card className="group bg-gradient-to-br from-white to-orange-50/50 border-0 shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform">
                <Coffee className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Gourmet Dining</h4>
              <p className="text-gray-600 text-sm">Multi-cuisine restaurant & 24/7 cafe</p>
              <div className="mt-4 flex items-center justify-center text-xs text-orange-600 font-medium">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                4.8★ Rated
              </div>
            </Card>

            <Card className="group bg-gradient-to-br from-white to-purple-50/50 border-0 shadow-lg hover:shadow-2xl p-6 text-center transition-all duration-500 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Premium Security</h4>
              <p className="text-gray-600 text-sm">AI-powered security & biometric access</p>
              <div className="mt-4 flex items-center justify-center text-xs text-purple-600 font-medium">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                Zero Incidents
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Gallery Section */}
      <section id="gallery" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Life at Campus Hostel</h3>
            <p className="text-xl text-gray-600">Discover spaces designed for your success and happiness</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group bg-white border-0 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1706016899218-ebe36844f70e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwaG9zdGVsfGVufDF8fHx8MTc1NzEzMTI5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Campus Building"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">Award Winning Architecture</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Modern Campus</h4>
                <p className="text-gray-600 leading-relaxed">State-of-the-art architecture with sustainable design and smart building technology</p>
              </CardContent>
            </Card>
            
            <Card className="group bg-white border-0 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1549881567-c622c1080d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjByb29tJTIwZG9ybWl0b3J5fGVufDF8fHx8MTc1NzEzMTI5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Hostel Room"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 fill-red-400 text-red-400" />
                    <span className="text-sm font-medium">5★ Comfort Rating</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Luxury Rooms</h4>
                <p className="text-gray-600 leading-relaxed">Premium furnished rooms with study areas, AC, and high-speed internet connectivity</p>
              </CardContent>
            </Card>
            
            <Card className="group bg-white border-0 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1708901141722-d5b0583407b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZGluaW5nJTIwaGFsbHxlbnwxfHx8fDE3NTcxMzEzMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Dining Hall"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-2">
                    <Coffee className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium">Chef's Special Daily</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Fine Dining</h4>
                <p className="text-gray-600 leading-relaxed">Restaurant-quality dining with diverse cuisines and dietary options available 24/7</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:60px_60px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium text-sm shadow-lg mb-4">
              <Phone className="w-4 h-4 mr-2" />
              Get In Touch
            </div>
            <h3 className="text-4xl font-bold mb-4">Ready to Join Our Community?</h3>
            <p className="text-xl text-blue-100">Our team is here to help you get started</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4">Call Us</h4>
              <div className="space-y-3">
                <p className="text-blue-100 text-lg">+91 98765 43210</p>
                <p className="text-blue-100 text-lg">+91 87654 32109</p>
              </div>
              <p className="text-sm text-blue-200 mt-4">Available 24/7</p>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4">Email Us</h4>
              <div className="space-y-3">
                <p className="text-blue-100 text-lg">hostel@campus.edu</p>
                <p className="text-blue-100 text-lg">admin@campus.edu</p>
              </div>
              <p className="text-sm text-blue-200 mt-4">Quick response guaranteed</p>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-4">Visit Us</h4>
              <div className="space-y-3">
                <p className="text-blue-100 text-lg">Campus Hostel Block A</p>
                <p className="text-blue-100 text-lg">University Campus, City 123456</p>
              </div>
              <p className="text-sm text-blue-200 mt-4">Open for tours daily</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-2xl">H</span>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white">Campus Hostel</h4>
                <p className="text-gray-400">Premium Student Living</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <a href="#facilities" className="text-gray-400 hover:text-white transition-colors">Facilities</a>
              <a href="#gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
            
            <div className="text-center lg:text-right">
              <p className="text-gray-400">&copy; 2025 Campus Hostel Automation</p>
              <p className="text-gray-500 text-sm">Your comfort and success is our priority</p>
            </div>
          </div>
          
          {/* Additional footer content */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Live Support Available</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-400">
                <Shield className="w-4 h-4" />
                <span className="text-sm">100% Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm">Trusted by 500+ Students</span>
              </div>
            </div>
          </div>


        </div>
      </footer>
    </div>
  );
}

export default LandingPage;