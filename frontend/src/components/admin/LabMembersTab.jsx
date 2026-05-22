import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Plus, Pencil, Trash2, Loader2, GraduationCap, GripVertical, ArrowUpDown } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { labApi, adminApi, formatApiErrorDetail } from '../../services/api';
import ImageUploader from '../ImageUploader';
import CvUploader from '../CvUploader';
import { toast } from 'sonner';

const empty = { name: '', title: '', image: '', bio: '', research: '', email: '', linkedin: '#', scholar: '#', cv_url: '', is_alumni: false, current_workplace: '' };

const LabMembersTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await labApi.getLabMembers());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setDialogOpen(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...item, research: item.research.join(', ') });
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        research: form.research.split(',').map((s) => s.trim()).filter(Boolean),
      };
      if (editing) {
        await adminApi.updateLabMember(editing.id, payload);
        toast.success('Lab member updated');
      } else {
        await adminApi.createLabMember(payload);
        toast.success('Lab member created');
      }
      setDialogOpen(false);
      await load();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteLabMember(deleteId);
      toast.success('Lab member deleted');
      setDeleteId(null);
      await load();
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || 'Failed to delete');
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
    setHasUnsavedOrder(true);
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      await adminApi.reorderLabMembers(items.map(item => item.id));
      toast.success('Order saved successfully');
      setHasUnsavedOrder(false);
      setIsReordering(false);
      await load();
    } catch (err) {
      toast.error('Failed to save order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Lab Members</h2>
          <p className="text-sm text-slate-500">Manage team profiles</p>
        </div>
        <div className="flex gap-2">
          {!isReordering && items.length > 1 && (
            <Button variant="outline" onClick={() => setIsReordering(true)} className="text-slate-700">
              <ArrowUpDown className="w-4 h-4 mr-2" /> Reorder
            </Button>
          )}
          <Button onClick={openCreate} data-testid="add-member-button" className="bg-teal-600 hover:bg-teal-700 text-white" disabled={isReordering}>
            <Plus className="w-4 h-4 mr-2" /> Add Member
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
      ) : isReordering ? (
        <div className="bg-slate-50 p-4 sm:p-6 rounded-lg border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-800">Drag items to reorder</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setIsReordering(false); load(); setHasUnsavedOrder(false); }}>Cancel</Button>
              <Button onClick={handleSaveOrder} disabled={!hasUnsavedOrder || saving} className="bg-teal-600 hover:bg-teal-700 text-white">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save Order
              </Button>
            </div>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="members">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {items.map((m, index) => (
                    <Draggable key={m.id.toString()} draggableId={m.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center gap-4 bg-white p-3 rounded-lg border shadow-sm transition-shadow ${snapshot.isDragging ? 'shadow-md border-teal-300' : 'border-gray-200'}`}
                        >
                          <div {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-teal-600 p-2 -ml-2">
                            <GripVertical size={20} />
                          </div>
                          <div className={`w-12 h-12 rounded bg-gray-100 overflow-hidden flex-shrink-0 ${m.is_alumni ? 'grayscale' : ''}`}>
                            <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 truncate flex items-center gap-2">
                              {m.name} 
                              {m.is_alumni && <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-white px-2 py-0.5 rounded-full">Alumni</span>}
                            </p>
                            <p className="text-sm text-slate-500 truncate">{m.title}</p>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((m) => (
            <Card key={m.id} className={`border-gray-200 overflow-hidden relative ${m.is_alumni ? 'opacity-70' : ''}`} data-testid={`member-admin-card-${m.id}`}>
              {m.is_alumni && (
                <div className="absolute top-2 right-2 bg-slate-800 text-white text-xs px-2 py-1 rounded-full flex items-center z-10 shadow-sm">
                  <GraduationCap className="w-3 h-3 mr-1" /> Alumni
                </div>
              )}
              <div className="h-48 bg-gray-100 overflow-hidden relative">
                <img src={m.image} alt={m.name} className={`w-full h-full object-cover ${m.is_alumni ? 'grayscale' : ''}`} />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-800">{m.name}</h3>
                <p className="text-sm text-teal-600 mb-2">{m.title}</p>
                {m.is_alumni && m.current_workplace && (
                  <p className="text-xs text-slate-600 mb-2 font-medium">🏢 {m.current_workplace}</p>
                )}
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{m.bio}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(m)} data-testid={`edit-member-${m.id}`} className="flex-1">
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setDeleteId(m.id)} data-testid={`delete-member-${m.id}`} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && (
            <p className="col-span-full text-center text-slate-500 py-8">No lab members yet.</p>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Lab Member' : 'Add Lab Member'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4 mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_alumni"
                  checked={form.is_alumni}
                  onChange={(e) => setForm({ ...form, is_alumni: e.target.checked })}
                  className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                />
                <Label htmlFor="is_alumni" className="font-semibold text-slate-700 cursor-pointer">
                  This person is an Alumni (Old Member)
                </Label>
              </div>
              
              {form.is_alumni && (
                <div className="pl-6 animate-in slide-in-from-top-2 duration-200">
                  <Label className="mb-2 block">Current Workplace</Label>
                  <Input 
                    value={form.current_workplace || ''} 
                    onChange={(e) => setForm({ ...form, current_workplace: e.target.value })} 
                    placeholder="e.g. Google, MIT, NASA" 
                    className="bg-white"
                  />
                  <p className="text-xs text-slate-500 mt-1">For alumni, we typically only show their name and workplace.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required data-testid="member-name-input" />
              </div>
              <div>
                <Label className="mb-2 block">Title / Previous Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Principal Investigator" />
              </div>
            </div>
            <div>
              <ImageUploader
                label="Photo (Optional for Alumni)"
                value={form.image}
                onChange={(v) => setForm({ ...form, image: v })}
              />
            </div>
            <div>
              <Label className="mb-2 block">Bio</Label>
              <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} required={!form.is_alumni} rows={3} />
            </div>
            <div>
              <Label className="mb-2 block">Research Interests (comma-separated)</Label>
              <Input value={form.research} onChange={(e) => setForm({ ...form, research: e.target.value })} required={!form.is_alumni} placeholder="Nanotechnology, Gas sensors, AI" />
            </div>
            <div>
              <CvUploader
                label="CV (optional)"
                value={form.cv_url || ''}
                onChange={(v) => setForm({ ...form, cv_url: v })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="mb-2 block">Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required={!form.is_alumni} />
              </div>
              <div>
                <Label className="mb-2 block">LinkedIn URL</Label>
                <Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="#" />
              </div>
              <div>
                <Label className="mb-2 block">Scholar URL</Label>
                <Input value={form.scholar} onChange={(e) => setForm({ ...form, scholar: e.target.value })} placeholder="#" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving} data-testid="save-member-button" className="bg-teal-600 hover:bg-teal-700 text-white">
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lab member?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LabMembersTab;
