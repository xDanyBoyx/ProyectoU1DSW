import { toast } from 'sonner';
import { AlertCircleIcon, CheckCircle2, X, InfoIcon } from 'lucide-react';

const toastConfig = {
    info: {
        Icon: InfoIcon,
        bgClass: 'bg-blue-500',
        buttonHoverClass: 'hover:bg-white/10',
    },
    error: {
        Icon: AlertCircleIcon,
        bgClass: 'bg-red-500',
        buttonHoverClass: 'hover:bg-white/10',
    },
    success: {
        Icon: CheckCircle2,
        bgClass: 'bg-emerald-500',
        buttonHoverClass: 'hover:bg-white/10',
    },
};

const CustomToast = ({ t, type = 'info', title, message }) => {
    const { Icon, bgClass, buttonHoverClass } = toastConfig[type] || toastConfig.info;

    return (
        <div className={`relative flex items-start gap-4 text-white p-4 pr-10 rounded-lg shadow-lg ${bgClass}`}>
            <Icon className="h-6 w-6 shrink-0 mt-0.5" />
            <div className="flex-1">
                <p className="text-md font-semibold">{title}</p>
                <p className="text-sm">{message}</p>
            </div>
            <button
                onClick={() => toast.dismiss(t)}
                className={`absolute top-2 right-2 p-1 rounded-full text-white/70 hover:text-white ${buttonHoverClass} focus:outline-none focus:ring-2 focus:ring-white`}
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
};

export default CustomToast;