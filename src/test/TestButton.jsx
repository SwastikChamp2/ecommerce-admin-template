import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function TestButton() {
    const brands = [
        { docID: "Camel", label: "Camel" },
        { docID: "Faber-Castell", label: "Faber-Castell" },
        { docID: "Staedtler", label: "Staedtler" },
        { docID: "Doms", label: "Doms" },
        { docID: "Camlin", label: "Camlin" },
        { docID: "Luxor", label: "Luxor" },
        { docID: "Monami", label: "Monami" },
        { docID: "Schneider", label: "Schneider" },
        { docID: "Pentel", label: "Pentel" },
        { docID: "Pilot", label: "Pilot" },
        { docID: "Kokuyo", label: "Kokuyo" },
        { docID: "Nataraj", label: "Nataraj" },
        { docID: "OHPen", label: "OHPen" },
        { docID: "Bic", label: "Bic" },
        { docID: "Zebra", label: "Zebra" },
        { docID: "Stabilo", label: "Stabilo" },
    ];

    const handleSeedBrands = async () => {
        try {
            const collectionRef = collection(db, "brands");

            for (const brand of brands) {
                await setDoc(doc(collectionRef, brand.docID), {
                    docID: brand.docID,
                    label: brand.label,
                });
            }

            alert("Brands successfully added!");
        } catch (error) {
            console.error("Error adding brands:", error);
        }
    };

    return (
        <button
            onClick={handleSeedBrands}
            style={{
                padding: "10px 20px",
                backgroundColor: "#111",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
            }}
        >
            Seed Brands
        </button>
    );
}