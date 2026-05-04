import { Card } from '@heroui/react';
import AutismSupportBot from '../AutismSupportBot';

export default function AssistantAuraTab({ isArabic, auraCard, SectionTitle }) {
    return (
        <div className="space-y-6">
            <SectionTitle icon="/icons/assistant_aura.png" title={isArabic ? 'المساعد الذكي' : 'Assistant Aura'} badge="Online" badgeColor="#10B981" />
            <Card className={`rounded-[50px] border overflow-hidden ${auraCard}`}>
                <AutismSupportBot mode="parent" />
            </Card>
        </div>
    );
}
