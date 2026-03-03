import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Card, Button, Input, LoadingSpinner, Modal } from "../../components/ui";
import { toast } from "react-toastify";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [label, setLabel] = useState("");
    const [docID, setDocID] = useState("");

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, "categories"));
            setCategories(snapshot.docs.map(doc => ({ docID: doc.id, ...doc.data() })));
        } catch (err) {
            toast.error("Failed to fetch categories");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddOrEdit = async () => {
        if (!label.trim()) return toast.error("Label required");
        if (!docID.trim()) return toast.error("ID required");
        try {
            if (editCategory) {
                await updateDoc(doc(db, "categories", editCategory.docID), { label, docID });
                toast.success("Category updated");
            } else {
                await setDoc(doc(db, "categories", docID), { label, docID });
                toast.success("Category added");
            }
            setModalOpen(false);
            setEditCategory(null);
            setLabel("");
            setDocID("");
            fetchCategories();
        } catch {
            toast.error("Error saving category");
        }
    };

    // Auto-update docID when label changes, unless editing and docID was manually changed
    useEffect(() => {
        if (!editCategory) {
            setDocID(label ? label.replace(/\s+/g, "-").replace(/[^\w-]/g, "") : "");
        }
    }, [label, editCategory]);

    return (
        <div className="space-y-6">
            <Card title="Categories" subtitle="Manage all categories">
                <Button onClick={() => { setEditCategory(null); setLabel(""); setDocID(""); setModalOpen(true); }} variant="primary">Add Category</Button>
                {loading ? <LoadingSpinner text="Loading categories..." /> : (
                    <div className="mt-4 space-y-2">
                        {categories.map(category => (
                            <div key={category.docID} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="font-semibold">{category.label}</span>
                                <Button size="sm" variant="secondary" onClick={() => { setEditCategory(category); setLabel(category.label); setDocID(category.docID); setModalOpen(true); }}>Edit</Button>
                            </div>
                        ))}
                        {categories.length === 0 && <p className="text-gray-500">No categories found.</p>}
                    </div>
                )}
            </Card>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editCategory ? "Edit Category" : "Add Category"}>
                <div className="space-y-4">
                    <Input label="Category Label" value={label} onChange={e => setLabel(e.target.value)} />
                    <Input label="Category ID" value={docID} onChange={e => setDocID(e.target.value)} />
                    <Button onClick={handleAddOrEdit} variant="primary">{editCategory ? "Update" : "Add"}</Button>
                </div>
            </Modal>
        </div>
    );
};

export default Categories;
