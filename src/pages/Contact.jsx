import React, { useState } from 'react';
import { Phone, MapPin, Clock, Send } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useConfig } from '../hooks/useConfig';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  const { getCompany } = useConfig();
  const company = getCompany();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    alert('Thank you for your enquiry! We will contact you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Get in touch with our team for product enquiries, technical support, or to schedule a visit to our showroom
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="font-heading font-semibold text-2xl lg:text-3xl text-foreground mb-6">
                Get In Touch
              </h2>
              <p className="text-lg text-muted leading-relaxed mb-8">
                Whether you're looking for diagnostic equipment, need technical support, or want to schedule training, 
                our team is here to help. Contact us through any of the channels below.
              </p>
            </div>

            {/* Main Office */}
            <Card className="border border-border dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="font-heading font-semibold text-xl text-foreground">
                  Main Office & Warehouse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-ui font-semibold text-foreground mb-1">Address</p>
                    <p className="text-muted">{company.hq}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-ui font-semibold text-foreground mb-1">Phone</p>
                    <a href={`tel:${company.phone}`} className="text-primary hover:underline">
                      {company.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-ui font-semibold text-foreground mb-1">Working Hours</p>
                    <div className="text-muted text-sm space-y-1">
                      {company.workingHours.map((hours, index) => (
                        <div key={index}>{hours}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Showroom */}
            <Card className="border border-border bg-primary-light dark:bg-gray-700">
              <CardHeader>
                <CardTitle className="font-heading font-semibold text-xl text-foreground">
                  Showroom & Display Center
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-ui font-semibold text-foreground mb-1">Address</p>
                    <p className="text-muted">{company.showroom.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-ui font-semibold text-foreground mb-1">Phone</p>
                    <a href={`tel:${company.showroom.phone}`} className="text-primary hover:underline">
                      {company.showroom.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-ui font-semibold text-foreground mb-1">Showroom Hours</p>
                    <p className="text-muted text-sm">{company.showroom.hours[0]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="border border-primary bg-primary text-primary-foreground">
              <CardContent className="p-6 text-center">
                <h3 className="font-heading font-semibold text-lg mb-3">Need Immediate Assistance?</h3>
                <p className="mb-4 opacity-90">Call our technical support hotline</p>
                <a href={`tel:${company.phone}`}>
                  <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
                    <Phone className="w-5 h-5 mr-2" />
                    {company.phone}
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border border-border dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="font-heading font-semibold text-2xl text-foreground">
                  Send Us a Message
                </CardTitle>
                <p className="text-muted">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-ui font-semibold text-sm text-foreground mb-2 block">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="font-ui font-semibold text-sm text-foreground mb-2 block">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-ui font-semibold text-sm text-foreground mb-2 block">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+971-X-XXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="font-ui font-semibold text-sm text-foreground mb-2 block">
                        Company Name
                      </label>
                      <Input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-ui font-semibold text-sm text-foreground mb-2 block">
                      Subject *
                    </label>
                    <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select enquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product-enquiry">Product Enquiry</SelectItem>
                        <SelectItem value="technical-support">Technical Support</SelectItem>
                        <SelectItem value="training">Training Programs</SelectItem>
                        <SelectItem value="warranty">Warranty Support</SelectItem>
                        <SelectItem value="pricing">Pricing Information</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="font-ui font-semibold text-sm text-foreground mb-2 block">
                      Message *
                    </label>
                    <Textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Please provide details about your enquiry..."
                      className="resize-none"
                    />
                  </div>

                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-ui font-semibold text-sm uppercase tracking-wide"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;