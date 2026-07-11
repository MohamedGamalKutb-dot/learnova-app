import { useState } from 'react';
import { Card, CardBody, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { useAuth } from '../../../shared/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProfileAccountSettings({ isDark, isArabic, activeUser, userRole }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const { deleteAccount } = useAuth();
    const navigate = useNavigate();

    const handleDelete = async () => {
        setLoading(true);
        const id = userRole === 'child' ? activeUser.childId : activeUser.id;
        await deleteAccount(userRole, id);
        setLoading(false);
        onClose();
        navigate('/');
    };

    return (
        <Card className={`mt-10 rounded-[30px] border transition-all duration-700 backdrop-blur-3xl ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white/40 border-indigo-100'}`}>
            <CardBody className="p-8 flex items-center justify-between flex-row">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{isArabic ? 'تاريخ الانضمام' : 'MEMBER SINCE'}</span>
                    <div className="flex items-center gap-2 mt-0.5" dir="ltr">
                        <span className="text-lg font-black text-indigo-500">
                            {activeUser.createdAt ? new Date(activeUser.createdAt).getDate().toString().padStart(2, '0') : '--'}
                        </span>
                        <span className="text-lg font-black opacity-20">/</span>
                        <span className="text-lg font-black text-indigo-500">
                            {activeUser.createdAt ? (new Date(activeUser.createdAt).getMonth() + 1).toString().padStart(2, '0') : '--'}
                        </span>
                        <span className="text-lg font-black opacity-20">/</span>
                        <span className="text-lg font-black text-indigo-500">
                            {activeUser.createdAt ? new Date(activeUser.createdAt).getFullYear() : '----'}
                        </span>
                    </div>
                </div>

                <Button 
                    color="danger" 
                    variant="flat" 
                    className="font-bold"
                    onPress={onOpen}
                >
                    {isArabic ? 'حذف الحساب' : 'Delete Account'}
                </Button>
            </CardBody>

            <Modal isOpen={isOpen} onClose={onClose} placement="center" backdrop="blur">
                <ModalContent className={`${isDark ? 'bg-bg-dark text-text-dark border border-border-dark' : 'bg-white text-text'}`}>
                    <ModalHeader className="flex flex-col gap-1">
                        {isArabic ? 'تأكيد الحذف' : 'Confirm Deletion'}
                    </ModalHeader>
                    <ModalBody>
                        <p className="text-danger-500 font-bold mb-2 text-xl text-center">
                            ⚠️ {isArabic ? 'تحذير' : 'WARNING'} ⚠️
                        </p>
                        <p className="text-center opacity-80">
                            {isArabic 
                                ? 'هل أنت متأكد من رغبتك في حذف الحساب نهائياً؟ ' 
                                : 'Are you sure you want to permanently delete your account? '}
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onClose} isDisabled={loading}>
                            {isArabic ? 'إلغاء' : 'Cancel'}
                        </Button>
                        <Button color="danger" onPress={handleDelete} isLoading={loading}>
                            {isArabic ? 'نعم، احذف حسابي' : 'Yes, delete my account'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>
    );
}
