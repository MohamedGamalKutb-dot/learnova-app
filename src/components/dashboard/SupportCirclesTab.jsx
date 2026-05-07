import { Card } from '@heroui/react';
import ClinicsMap from '../ClinicsMap';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function SupportCirclesTab({ isArabic, auraCard, SectionTitle }) {
    return (
        <div className="space-y-6">
            <SectionTitle icon={<FaMapMarkerAlt className="text-blue-600" />} title={isArabic ? 'العيادات القريبة' : 'Support Circles'} />
            <Card className={`rounded-[50px] border ${auraCard}`}>
                <ClinicsMap />
            </Card>
        </div>
    );
}
