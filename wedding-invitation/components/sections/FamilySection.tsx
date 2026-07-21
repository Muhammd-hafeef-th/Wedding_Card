"use client";
// components/sections/FamilySection.tsx
import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";
import { WeddingData } from "@/types";

interface FamilySectionProps {
  wedding: WeddingData;
}

export default function FamilySection({ wedding }: FamilySectionProps) {
  // Helper to format parents names nicely
  const formatParents = (father?: string, mother?: string, defaultText = "") => {
    if (!father && !mother) return defaultText;
    if (father && mother) {
      const fName = father.trim();
      const mName = mother.trim();
      return `${fName} & ${mName}`;
    }
    return father || mother || "";
  };

  return (
    <section id="families" className="section-padding relative">
      <div className="container-luxury relative z-10">
        
        {/* Section Heading */}
        <div style={{ marginBottom: "4rem" }}>
          <SectionTitle
            eyebrow="With the blessings of"
            title="Our Families"
          />
        </div>

        <div className="family-wrapper">
          <div className="family-grid">
            
            {/* Bride's Family Card */}
            <motion.div
              className="family-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="family-role">Bride</span>
              <h4 className="family-member-name">
                {wedding.brideFirstName}
              </h4>
              <span className="family-relation">Daughter of</span>
              <p className="family-parents">
                {formatParents(
                  wedding.brideFatherName,
                  wedding.brideMotherName,
                  "Mr. Mohamed Ismail & Mrs. Khadeeja Ismail"
                )}
              </p>

              {(wedding.bridePaternalGrandparents || wedding.brideMaternalGrandparents) && (
                <div className="family-divider" />
              )}

              {/* Bride Paternal Grandparents */}
              {wedding.bridePaternalGrandparents && (
                <>
                  <span className="family-grandparent-label">Paternal Grandparents</span>
                  <p className="family-grandparent-names">
                    {wedding.bridePaternalGrandparents}
                  </p>
                </>
              )}

              {/* Bride Maternal Grandparents */}
              {wedding.brideMaternalGrandparents && (
                <>
                  <span className="family-grandparent-label">Maternal Grandparents</span>
                  <p className="family-grandparent-names" style={{ marginBottom: 0 }}>
                    {wedding.brideMaternalGrandparents}
                  </p>
                </>
              )}

              {/* Bride Siblings */}
              {wedding.brideSiblings && wedding.brideSiblings.length > 0 && (
                <>
                  <div className="family-divider" style={{ marginTop: '1rem', marginBottom: '1rem' }} />
                  <span className="family-grandparent-label">Siblings</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {wedding.brideSiblings.map((sibling, idx) => (
                      <p key={idx} className="family-grandparent-names" style={{ marginBottom: 0 }}>
                        {sibling}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            {/* Groom's Family Card */}
            <motion.div
              className="family-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
            >
              <span className="family-role">Groom</span>
              <h4 className="family-member-name">
                {wedding.groomFirstName}
              </h4>
              <span className="family-relation">Son of</span>
              <p className="family-parents">
                {formatParents(
                  wedding.groomFatherName,
                  wedding.groomMotherName,
                  "Mr. Hamza Kurikkal OP & Mrs. Subaida MC"
                )}
              </p>

              {(wedding.groomPaternalGrandparents || wedding.groomMaternalGrandparents) && (
                <div className="family-divider" />
              )}

              {/* Groom Paternal Grandparents */}
              {wedding.groomPaternalGrandparents && (
                <>
                  <span className="family-grandparent-label">Paternal Grandparents</span>
                  <p className="family-grandparent-names">
                    {wedding.groomPaternalGrandparents}
                  </p>
                </>
              )}

              {/* Groom Maternal Grandparents */}
              {wedding.groomMaternalGrandparents && (
                <>
                  <span className="family-grandparent-label">Maternal Grandparents</span>
                  <p className="family-grandparent-names" style={{ marginBottom: 0 }}>
                    {wedding.groomMaternalGrandparents}
                  </p>
                </>
              )}

              {/* Groom Siblings */}
              {wedding.groomSiblings && wedding.groomSiblings.length > 0 && (
                <>
                  <div className="family-divider" style={{ marginTop: '1rem', marginBottom: '1rem' }} />
                  <span className="family-grandparent-label">Siblings</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {wedding.groomSiblings.map((sibling, idx) => (
                      <p key={idx} className="family-grandparent-names" style={{ marginBottom: 0 }}>
                        {sibling}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
