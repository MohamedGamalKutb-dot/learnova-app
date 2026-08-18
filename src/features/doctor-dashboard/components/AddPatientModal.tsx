import { Modal, ModalContent, ModalBody, ModalHeader, ModalFooter, Button, Input, Avatar } from '@heroui/react';
import { FaUserPlus, FaSearch } from 'react-icons/fa';

interface AddPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    isArabic: boolean;
    isDark: boolean;
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    handleSearch: () => void;
    isSearching: boolean;
    searchError: string;
    searchResult: any;
    isAdding: boolean;
    handleAddPatient: () => void;
    subBg: string;
}

export default function AddPatientModal({
    isOpen,
    onClose,
    isArabic,
    isDark,
    searchQuery,
    setSearchQuery,
    handleSearch,
    isSearching,
    searchError,
    searchResult,
    isAdding,
    handleAddPatient,
    subBg
}: AddPatientModalProps) {
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            size="md" 
            backdrop="blur" 
            classNames={{ 
                base: isDark ? 'bg-card-dark border border-border-dark' : 'bg-card border border-border', 
                closeButton: 'hidden' 
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className={`flex flex-col gap-1 text-center mt-2 pb-0 ${isDark ? 'text-text-dark' : 'text-text'}`}>
                            <h3 className={`m-0 text-lg font-bold flex items-center justify-center gap-2`}>
                                <FaUserPlus className="text-accent" />
                                {isArabic ? 'إضافة مريض جديد' : 'Add New Patient'}
                            </h3>
                        </ModalHeader>
                        <ModalBody className="pb-6">
                            <div className={`p-4 rounded-[14px] mb-4 border ${subBg} ${isDark ? 'border-border-dark' : 'border-border'}`}>
                                <label className={`block text-xs mb-2 font-semibold ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>
                                    {isArabic ? 'كود الطفل أو رقم هاتف الوالد' : 'Child Code OR Parent Phone'}
                                </label>
                                <div className="flex gap-2">
                                    <Input 
                                        variant="bordered" 
                                        radius="lg"
                                        value={searchQuery} 
                                        onChange={e => setSearchQuery(e.target.value)} 
                                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                        placeholder="LN-XXXXXX or 01xxxxxxx" 
                                        className="flex-1"
                                        classNames={{ inputWrapper: `${isDark ? 'bg-bg-dark border-border-dark' : 'bg-[#F9FAFB] border-border'} focus-within:!border-accent` }} 
                                    />
                                    <Button 
                                        isIconOnly 
                                        radius="lg" 
                                        isLoading={isSearching} 
                                        className="bg-gradient-to-br from-accent to-[#4834D4] text-white shadow-[0_2px_8px_rgba(108,99,255,0.2)] text-base flex items-center justify-center" 
                                        onPress={handleSearch}
                                    >
                                        {!isSearching && <FaSearch className="text-sm" />}
                                    </Button>
                                </div>
                                {searchError && <div className="text-red-500 text-xs mt-2">⚠️ {searchError}</div>}
                            </div>
                            {searchResult && (
                                <div className={`text-center mb-0 p-4 rounded-[14px] border border-accent/20 ${subBg}`} style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                                    <Avatar 
                                        radius="full"
                                        className="w-24 h-24 text-4xl mx-auto shadow-xl border-4 border-white/20"
                                        src={searchResult.avatar?.length > 10 ? searchResult.avatar : undefined}
                                        name={searchResult.avatar?.length <= 2 ? searchResult.avatar : undefined}
                                    />
                                    <div className={`font-bold text-lg mt-1.5 ${isDark ? 'text-text-dark' : 'text-text'}`}>{searchResult.name}</div>
                                    <div className={`text-[13px] mt-0.5 ${isDark ? 'text-subtext-dark' : 'text-subtext'}`}>{searchResult.age} {isArabic ? 'سنوات' : 'Years'} • {searchResult.gender}</div>
                                    <Button 
                                        fullWidth 
                                        radius="lg" 
                                        isLoading={isAdding} 
                                        className="mt-3.5 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold shadow-[0_4px_12px_rgba(16,185,129,0.25)]" 
                                        onPress={handleAddPatient}
                                    >
                                        {!isAdding && "✅ "}
                                        {isArabic ? 'إضافة للقائمة' : 'Add to My List'}
                                    </Button>
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter className="pt-0">
                            <Button fullWidth variant="bordered" radius="lg" className={`${isDark ? 'border-border-dark text-subtext-dark' : 'border-border text-subtext'}`} onPress={onClose}>
                                {isArabic ? 'إلغاء' : 'Cancel'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
