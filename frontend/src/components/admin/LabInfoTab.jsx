import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Loader2, Save } from 'lucide-react';
import { labApi, adminApi, formatApiErrorDetail } from '../../services/api';
import ImageUploader from '../ImageUploader';
import { toast } from 'sonner';
import { useLabInfo } from '../../context/LabInfoContext';

const LabInfoTab = () => {
  const { refresh: refreshLabInfo } = useLabInfo();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    labApi.getLabInfo()
      .then((info) =>
        setData({
          ...info,
          hero_background_image:
            info.hero_background_image ||
            'https://images.unsplash.com/photo-1576141546153-3e04370b5ff7',
        })
      )
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateLabInfo(data);
      await refreshLabInfo();
      toast.success('Lab info updated successfully');
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
  }

  if (!data) return null;

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-800">Lab Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5" data-testid="lab-info-form">
          <div>
            <Label htmlFor="name" className="text-slate-700 mb-2 block">Website / lab name</Label>
            <Input id="name" name="name" value={data.name} onChange={handleChange} required data-testid="lab-info-name" />
          </div>
          <div>
            <Label htmlFor="tagline" className="text-slate-700 mb-2 block">Tagline</Label>
            <Input id="tagline" name="tagline" value={data.tagline} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="description" className="text-slate-700 mb-2 block">Description</Label>
            <Textarea id="description" name="description" value={data.description} onChange={handleChange} required rows={4} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="email" className="text-slate-700 mb-2 block">Email</Label>
              <Input id="email" name="email" type="email" value={data.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="phone" className="text-slate-700 mb-2 block">Phone</Label>
              <Input id="phone" name="phone" value={data.phone} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <Label htmlFor="address" className="text-slate-700 mb-2 block">Address</Label>
            <Input id="address" name="address" value={data.address} onChange={handleChange} required />
          </div>
          <div>
            <ImageUploader
              label="Lab Logo"
              value={data.logo_image || ''}
              onChange={(v) => setData({ ...data, logo_image: v })}
              aspect={1}
            />
            <p className="text-xs text-slate-500 mt-1">Upload your lab logo. It will appear in the navigation bar and footer. Square format recommended.</p>
          </div>
          <div>
            <ImageUploader
              label="Homepage hero background"
              value={data.hero_background_image || ''}
              onChange={(v) => setData({ ...data, hero_background_image: v })}
            />
            <p className="text-xs text-slate-500 mt-1">Upload an image or paste a URL for the main page background.</p>
          </div>
          <Button type="submit" disabled={saving} data-testid="lab-info-save-button" className="bg-teal-600 hover:bg-teal-700 text-white">
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LabInfoTab;
