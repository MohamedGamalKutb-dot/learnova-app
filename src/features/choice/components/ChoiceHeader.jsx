import { Chip } from '@heroui/react';

export default function ChoiceHeader({ T, tagBg, darkTxt, darkTxt2 }) {
    return (
        <div className="relative text-center mb-10 max-w-[520px]">
            <Chip variant="bordered" className={`${tagBg} text-p600 font-bold mb-5`}>{T.eyebrow}</Chip>
            <h1 className={`text-[clamp(28px,4vw,44px)] font-extrabold mb-3.5 ${darkTxt}`}>{T.pageTitle1}<span className="bg-gradient-to-br from-p600 to-a500 bg-clip-text [-webkit-text-fill-color:transparent]">{T.pageTitleGrad}</span></h1>
            <p className={`${darkTxt2} text-base`}>{T.pageDesc}</p>
        </div>
    );
}
