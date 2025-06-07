import React from 'react';
import ActivityItem from '@/components/molecules/ActivityItem';
import LoadingSkeleton from '@/components/organisms/LoadingSkeleton';
import EmptyState from '@/components/organisms/EmptyState';

const ActivityFeedList = ({ activities, loading }) => {
    if (loading) {
        return <LoadingSkeleton type="activity" count={5} />;
    }

    if (!activities.length) {
        return (
            <EmptyState
                iconName="Activity"
                title="No recent activity"
                description="Start by creating a project or adding a message"
            />
        );
    }

    return (
        <div className="space-y-4">
            {activities.map((activity, index) => (
                <ActivityItem key={activity.id} activity={activity} index={index} />
            ))}
        </div>
    );
};

export default ActivityFeedList;