import { Card } from '@heroui/react';
import ClinicsMap from '../ClinicsMap';

export default function SupportCirclesTab({ isArabic, auraCard, SectionTitle }) {
    return (
        <div className="space-y-6">
            <SectionTitle icon="/icons/support_circles.png" title={isArabic ? 'العيادات القريبة' : 'Support Circles'} />
            <Card className={`rounded-[50px] border ${auraCard}`}>
                <ClinicsMap />
            </Card>
        </div>
    );
}
