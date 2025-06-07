import React from 'react';

const AvatarGroup = ({ members }) => {
    if (!members || members.length === 0) {
        return null;
    }

    return (
        <div className="flex -space-x-2">
            {members.slice(0, 3).map((member, index) => (
                <div
                    key={index}
                    className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                >
                    {member.charAt(0).toUpperCase()}
                </div>
            ))}
            {members.length > 3 && (
                <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                    +{members.length - 3}
                </div>
            )}
        </div>
    );
};

export default AvatarGroup;