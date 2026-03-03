import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Card, Button, Input, LoadingSpinner, Modal } from "../../components/ui";
import { toast } from "react-toastify";

const Brands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editBrand, setEditBrand] = useState(null);
    const [label, setLabel] = useState("");
    const [docID, setDocID] = useState("");

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const snapshot = await getDocs(collection(db, "brands"));
            setBrands(snapshot.docs.map(doc => ({ docID: doc.id, ...doc.data() })));
        } catch (err) {
            toast.error("Failed to fetch brands");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleAddOrEdit = async () => {
        if (!label.trim()) return toast.error("Label required");
        if (!docID.trim()) return toast.error("ID required");
        try {
            if (editBrand) {
                await updateDoc(doc(db, "brands", editBrand.docID), { label, docID });
                toast.success("Brand updated");
            } else {
                await setDoc(doc(db, "brands", docID), { label, docID });
                toast.success("Brand added");
            }
            setModalOpen(false);
            setEditBrand(null);
            setLabel("");
            setDocID("");
            fetchBrands();
        } catch {
            toast.error("Error saving brand");
        }
    };

    // Auto-update docID when label changes, unless editing and docID was manually changed
    useEffect(() => {
        if (!editBrand) {
            setDocID(label ? label.replace(/\s+/g, "-").replace(/[^\w-]/g, "") : "");
        }
    }, [label, editBrand]);

    return (
        <div className="space-y-6">
            <Card title="Brands" subtitle="Manage all brands">
                <Button onClick={() => { setEditBrand(null); setLabel(""); setDocID(""); setModalOpen(true); }} variant="primary">Add Brand</Button>
                {loading ? <LoadingSpinner text="Loading brands..." /> : (
                    <div className="mt-4 space-y-2">
                        {brands.map(brand => (
                            <div key={brand.docID} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="font-semibold">{brand.label}</span>
                                <Button size="sm" variant="secondary" onClick={() => { setEditBrand(brand); setLabel(brand.label); setDocID(brand.docID); setModalOpen(true); }}>Edit</Button>
                            </div>
                        ))}
                        {brands.length === 0 && <p className="text-gray-500">No brands found.</p>}
                    </div>
                )}
            </Card>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editBrand ? "Edit Brand" : "Add Brand"}>
                <div className="space-y-4">
                    <Input label="Brand Label" value={label} onChange={e => setLabel(e.target.value)} />
                    <Input label="Brand ID" value={docID} onChange={e => setDocID(e.target.value)} />
                    <Button onClick={handleAddOrEdit} variant="primary">{editBrand ? "Update" : "Add"}</Button>
                </div>
            </Modal>
        </div>
    );
};

export default Brands;
