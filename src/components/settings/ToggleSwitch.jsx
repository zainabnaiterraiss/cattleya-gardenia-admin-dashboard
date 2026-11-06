const ToggleSwitch = ({ label, description, isOn, onToggle }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex-1">
                <p className="font-medium text-gray-100">{label}</p>
                {description && (
                    <p className="text-sm text-gray-400 mt-1">{description}</p>
                )}
            </div>
            <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    isOn ? 'bg-indigo-600' : 'bg-gray-600'
                }`}
                onClick={onToggle}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isOn ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );
};

export default ToggleSwitch;