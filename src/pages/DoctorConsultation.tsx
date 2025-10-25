import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Star, Calendar, Video, Phone, MapPin, CheckCircle2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import doctorConsultImage from '@/assets/doctor-consult.svg';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  consultationFee: number;
  hospital: string;
  location: string;
  bio: string;
  availability: string[];
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Sarah Mitchell',
    specialty: 'Cardiology',
    experience: 15,
    rating: 4.9,
    consultationFee: 150,
    hospital: 'City General Hospital',
    location: 'New York, NY',
    bio: 'Board-certified cardiologist with expertise in preventive cardiology and heart disease management.',
    availability: ['Mon 9:00 AM', 'Mon 2:00 PM', 'Wed 10:00 AM', 'Fri 3:00 PM']
  },
  {
    id: 2,
    name: 'Dr. James Chen',
    specialty: 'Dermatology',
    experience: 12,
    rating: 4.8,
    consultationFee: 120,
    hospital: 'Metropolitan Medical Center',
    location: 'Los Angeles, CA',
    bio: 'Specialized in medical and cosmetic dermatology with a focus on skin cancer prevention.',
    availability: ['Tue 11:00 AM', 'Thu 1:00 PM', 'Fri 9:00 AM']
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'General Practice',
    experience: 10,
    rating: 4.7,
    consultationFee: 100,
    hospital: 'Community Health Clinic',
    location: 'Chicago, IL',
    bio: 'Family physician providing comprehensive primary care for patients of all ages.',
    availability: ['Mon 10:00 AM', 'Tue 2:00 PM', 'Wed 3:00 PM', 'Thu 11:00 AM']
  },
  {
    id: 4,
    name: 'Dr. Michael Park',
    specialty: 'Orthopedics',
    experience: 18,
    rating: 4.9,
    consultationFee: 180,
    hospital: 'Sports Medicine Institute',
    location: 'Seattle, WA',
    bio: 'Orthopedic surgeon specializing in sports injuries and joint replacement procedures.',
    availability: ['Wed 9:00 AM', 'Thu 2:00 PM', 'Fri 10:00 AM']
  },
  {
    id: 5,
    name: 'Dr. Lisa Thompson',
    specialty: 'Pediatrics',
    experience: 14,
    rating: 4.8,
    consultationFee: 110,
    hospital: 'Children\'s Healthcare',
    location: 'Boston, MA',
    bio: 'Pediatrician with extensive experience in child development and preventive care.',
    availability: ['Mon 1:00 PM', 'Tue 10:00 AM', 'Wed 11:00 AM', 'Thu 3:00 PM']
  },
  {
    id: 6,
    name: 'Dr. Robert Kumar',
    specialty: 'Neurology',
    experience: 20,
    rating: 4.9,
    consultationFee: 200,
    hospital: 'Brain & Spine Center',
    location: 'San Francisco, CA',
    bio: 'Neurologist specializing in headache disorders, stroke prevention, and cognitive health.',
    availability: ['Tue 9:00 AM', 'Wed 2:00 PM', 'Fri 11:00 AM']
  }
];

export default function DoctorConsultation() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    mode: 'video'
  });
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const specialties = ['all', 'Cardiology', 'Dermatology', 'General Practice', 'Orthopedics', 'Pediatrics', 'Neurology'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBooking = () => {
    if (!bookingData.date || !bookingData.time) {
      toast.error('Please select both date and time');
      return;
    }
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-secondary" />
        <span>Consultation booked successfully with {selectedDoctor?.name}!</span>
      </div>
    );
    setIsBookingOpen(false);
    setBookingData({ date: '', time: '', mode: 'video' });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Doctor Consultation</h1>
            <p className="text-muted-foreground text-lg">Connect with verified healthcare professionals</p>
          </div>
          <motion.img 
            src={doctorConsultImage} 
            alt="Doctor Consultation" 
            className="w-full md:w-64 h-auto float-animation"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
        </div>

        <Card className="card-health mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, specialty, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="w-full md:w-[200px] rounded-xl">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty === 'all' ? 'All Specialties' : specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="card-health h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{doctor.name}</CardTitle>
                      <CardDescription className="text-primary font-medium mt-1">
                        {doctor.specialty}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-gradient-primary text-white border-none">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {doctor.rating}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{doctor.hospital}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{doctor.experience} years experience</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-2xl font-bold text-primary">${doctor.consultationFee}</p>
                    <p className="text-xs text-muted-foreground">per consultation</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full mt-3 rounded-xl gradient-primary hover:opacity-90"
                        onClick={() => setSelectedDoctor(doctor)}
                      >
                        View Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl rounded-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">{doctor.name}</DialogTitle>
                        <DialogDescription className="text-primary font-medium text-base">
                          {doctor.specialty}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center gap-4 text-sm">
                          <Badge variant="secondary" className="bg-gradient-primary text-white border-none">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {doctor.rating}
                          </Badge>
                          <span className="text-muted-foreground">{doctor.experience} years</span>
                          <span className="text-muted-foreground">${doctor.consultationFee}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{doctor.hospital}, {doctor.location}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">About</h4>
                          <p className="text-sm text-muted-foreground">{doctor.bio}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Available Slots</h4>
                          <div className="flex flex-wrap gap-2">
                            {doctor.availability.map((slot) => (
                              <Badge key={slot} variant="outline" className="rounded-lg">
                                {slot}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                            <DialogTrigger asChild>
                              <Button className="flex-1 rounded-xl gradient-primary hover:opacity-90">
                                <Calendar className="h-4 w-4 mr-2" />
                                Book Consultation
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-2xl">
                              <DialogHeader>
                                <DialogTitle>Book Consultation</DialogTitle>
                                <DialogDescription>
                                  Schedule your appointment with {doctor.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Select Date</Label>
                                  <Input
                                    type="date"
                                    value={bookingData.date}
                                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                    className="rounded-xl"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Select Time</Label>
                                  <Select value={bookingData.time} onValueChange={(value) => setBookingData({ ...bookingData, time: value })}>
                                    <SelectTrigger className="rounded-xl">
                                      <SelectValue placeholder="Choose a time slot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {doctor.availability.map((slot) => (
                                        <SelectItem key={slot} value={slot}>
                                          {slot}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Consultation Mode</Label>
                                  <Select value={bookingData.mode} onValueChange={(value) => setBookingData({ ...bookingData, mode: value })}>
                                    <SelectTrigger className="rounded-xl">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="video">
                                        <div className="flex items-center gap-2">
                                          <Video className="h-4 w-4" />
                                          Video Call
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="audio">
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-4 w-4" />
                                          Audio Call
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="in-person">
                                        <div className="flex items-center gap-2">
                                          <MapPin className="h-4 w-4" />
                                          In-Person
                                        </div>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button onClick={handleBooking} className="w-full rounded-xl gradient-primary hover:opacity-90">
                                  Confirm Booking
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" className="rounded-xl">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat Preview
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
