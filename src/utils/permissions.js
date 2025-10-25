export const PERMISSIONS = {
    /**Super admin permissions */
    superAdmin: [
        /**Dashboard */
        '/admin/dashboard',
        '/admin/invoice-design',

        /** admin->profile */
        '/admin/profile',
        '/admin/profile/edit/*',
        '/admin/profile/change-password/*',


        /**Users Management */
        '/admin/user-management',
        '/admin/user-management/users/list/*',
        '/admin/user-management/users/view/*',
        '/admin/user-management/users/*/edit/*',
        '/admin/user-management/users/delete',
        '/admin/user-management/users/add',
        '/admin/user-management/users/more',
        '/admin/user-management/users/subscribe',
        '/admin/user-management/users/status',
        '/admin/user-management/users/Invite_users',
        '/admin/user-management/users/assign_media',
        '/admin/user-management/users/duplicate',
        '/admin/user-management/users/export',

        /**Staff */
        '/admin/staff',
        '/admin/staff/list/*',
        '/admin/staff/add',
        '/admin/staff/*/edit/*',
        '/admin/staff/view/*',
        '/admin/staff/status',
        '/admin/staff/more',
        '/admin/staff/duplicate',
        '/admin/staff/resend',
        '/admin/staff/delete',
        '/admin/staff/invite',
        '/admin/staff/multi-select',

        /**cms */
        '/admin/cms',

        /** cms->portal design */
        '/admin/cms/portal-design',
        '/admin/cms/portal-design/submit',
        '/admin/cms/portal-design/reset',

        /** cms->pages */
        '/admin/cms/pages/list/*',
        '/admin/cms/pages/add',
        '/admin/cms/pages/*/edit/*',
        '/admin/cms/pages/view/*',
        '/admin/cms/pages/more',
        '/admin/cms/pages/duplicate',
        '/admin/cms/pages/delete',
        '/admin/cms/pages/status',
        '/admin/cms/pages/multi-select',


        /** cms->banner */
        '/admin/cms/banner/list/*',
        '/admin/cms/banner/add',
        '/admin/cms/banner/*/edit/*',
        '/admin/cms/banner/view/*',
        '/admin/cms/banner/more',
        '/admin/cms/banner/duplicate',
        '/admin/cms/banner/delete',
        '/admin/cms/banner/status',
        '/admin/cms/banner/multi-select',


        /** cms->automatic email template */
        '/admin/cms/default-email-template/list/*',
        '/admin/cms/default-email-template/view/*',
        '/admin/cms/default-email-template/add',
        '/admin/cms/default-email-template/*/edit/*',
        '/admin/cms/default-email-template/status',
        '/admin/cms/default-email-template/delete',
        '/admin/cms/default-email-template/more',
        '/admin/cms/default-email-template/preview',
        '/admin/cms/default-email-template/multi-select',

        /** cms->push notification template */
        '/admin/cms/push-notification-template/list/*',
        '/admin/cms/push-notification-template/view/*',
        '/admin/cms/push-notification-template/add',
        '/admin/cms/push-notification-template/*/edit/*',
        '/admin/cms/push-notification-template/status',
        '/admin/cms/push-notification-template/delete',
        '/admin/cms/push-notification-template/more',
        '/admin/cms/push-notification-template/multi-select',
        '/admin/cms/push-notification-template/more',

        /** cms->newsletter email template */
        '/admin/cms/promotional-email-templates/list/*',
        '/admin/cms/promotional-email-templates/add',
        '/admin/cms/promotional-email-templates/*/edit/*',
        '/admin/cms/promotional-email-templates/view/*',
        '/admin/cms/promotional-email-templates/delete',
        '/admin/cms/promotional-email-templates/more',
        '/admin/cms/promotional-email-templates/test',
        '/admin/cms/promotional-email-templates/preview',
        '/admin/cms/promotional-email-templates/duplicate',
        '/admin/cms/promotional-email-templates/status',
        '/admin/cms/promotional-email-templates/multi-select',


        /** cms->global settings */
        '/admin/cms/settings',
        '/admin/cms/settings/submit',
        '/admin/cms/settings/toggle/activity-forum',

        /** cms->language files */
        '/admin/cms/language-files',
        '/admin/cms/language-files/frontend',
        '/admin/cms/language-files/backend',
        '/admin/cms/language-files/edit',
        '/admin/cms/language-files/action',
        '/admin/cms/language-files/button',

        /** cms->style files */
        '/admin/cms/style-files',


        /** newsletters */
        '/admin/news-letter',
        '/admin/news-letter/list/*',
        '/admin/news-letter/add',
        '/admin/news-letter/*/edit/*',
        '/admin/news-letter/view/*/*',
        '/admin/news-letter/delete',
        '/admin/news-letter/more',
        '/admin/news-letter/resend',
        '/admin/news-letter/newsletter',
        '/admin/news-letter/multi-select',
        '/admin/news-letter/distribution-list/list/*',

        /** distribution list */
        '/admin/distribution-list/list/*',
        '/admin/distribution-list/add',
        '/admin/distribution-list/*/edit/*',
        '/admin/distribution-list/view/*',
        '/admin/distribution-list/view/*/*',
        '/admin/distribution-list/multi-select',
        '/admin/distribution-list/status',
        '/admin/distribution-list/delete',
        '/admin/distribution-list/users-list/list/delete',
        '/admin/distribution-list/users-list/list/add',
        '/admin/distribution-list/users/list/multi-select',



        /** media */
        '/admin/media',
        '/admin/media/add',
        '/admin/media/details',
        '/admin/media/delete',

        /** email logs */
        '/admin/email-logs',
        '/admin/email-logs/list/*',
        '/admin/email-logs/view/*',
        '/admin/email-logs/resend',


        /** event management */
        '/admin/event-management',
        '/admin/event-management/events/list/*',
        '/admin/event-management/events/add',
        '/admin/event-management/events/add/*',
        '/admin/event-management/events/add/hotels/*',
        '/admin/event-management/events/add/agenda/*',
        '/admin/event-management/events/edit',
        '/admin/event-management/events/edit/*',

        /** event management->edit->hotels */
        '/admin/event-management/events/edit/hotels/*/*',
        '/admin/event-management/events/edit/hotels/delete',

        /** event management->edit->agenda */
        '/admin/event-management/events/edit/agenda/*/*',
        '/admin/event-management/events/edit/agenda/delete',

        '/admin/event-management/events/view',
        '/admin/event-management/events/view/event/*',
        '/admin/event-management/events/view/hotels/*/*',
        '/admin/event-management/events/view/agenda/*/*',
        '/admin/event-management/events/view/registrations/*/*',

        /** event management->events->view->invitations */
        '/admin/event-management/events/view/invitations/*',
        '/admin/event-management/events/view/invitations/more',
        '/admin/event-management/events/view/invitations/delete',
        '/admin/event-management/events/view/invitations/resend',
        '/admin/event-management/events/view/invitations/send',
        '/admin/event-management/events/view/invitations/action',
        '/admin/event-management/events/view/invitations/multi-select',

        /** event management->events->view->attendees */
        '/admin/event-management/events/view/attendees/*/*',

        /** event management->announcements */
        '/admin/event-management/events/view/event-announcements/*/*',
        '/admin/event-management/events/view/event-announcements/delete',
        '/admin/event-management/events/view/event-announcements/button',
        '/admin/event-management/events/view/event-announcements/multi-select',

        /** event management->transactions */
        '/admin/event-management/events/view/event-transactions/*/*',

        '/admin/event-management/events/view/checkIn-checkOut/*/*',
        '/admin/event-management/events/view/*',
        '/admin/event-management/events/view/invoice/*',
        '/admin/event-management/events/registration-edit/*',
        '/admin/event-management/events/attendees/*',
        '/admin/event-management/events/registration-edit-step-two',
        '/admin/event-management/events/delete',
        '/admin/event-management/events/more',
        '/admin/event-management/events/button',
        '/admin/event-management/events/multi-select',

        /** Questions set */
        '/admin/question-settings',
        '/admin/question-settings/sets/list/*',
        '/admin/question-settings/sets/add',
        '/admin/question-settings/sets/*/edit/*',
        '/admin/question-settings/sets/*/edit/*/question-set',
        '/admin/question-settings/sets/view/*',
        '/admin/question-settings/sets/status',
        '/admin/question-settings/sets/delete',
        // '/admin/question-settings/sets/delete/survey',
        // '/admin/question-settings/sets/more',
        // '/admin/question-settings/sets/reorder',
        // '/admin/question-settings/sets/newQuestions',
        // '/admin/question-settings/sets/duplicate',
        '/admin/question-settings/sets/multi-select',
        '/admin/question-settings/sets/question-set',
        '/admin/question-settings/sets/survey',
        '/admin/question-settings/sets/more/question-set',
        '/admin/question-settings/sets/reorder/question-set',
        '/admin/question-settings/sets/newQuestions/question-set',
        '/admin/question-settings/sets/duplicate/question-set',
        '/admin/question-settings/sets/delete/question-set',

        /** survey */
        '/admin/question-settings/questions/add',
        '/admin/question-settings/questions/*/edit/*',
        '/admin/question-settings/questions/view/*',
        '/admin/question-settings/questions/more',
        '/admin/question-settings/questions/duplicate',
        '/admin/question-settings/questions/delete',
        '/admin/question-settings/questions/status',

        /** activity forum */
        '/admin/activity-forum',
        '/admin/activity-forum/activities/list/*',
        '/admin/activity-forum/activities/add',
        '/admin/activity-forum/activities/*/edit/*',
        '/admin/activity-forum/activities/view/*',
        '/admin/activity-forum/activities/more',
        '/admin/activity-forum/activities/status',
        '/admin/activity-forum/activities/delete',
        '/admin/activity-forum/activities/duplicate',
        '/admin/activity-forum/activities/multi-select',


        /** topics */
        '/admin/activity-forum/topics/list/*',
        '/admin/activity-forum/topics/add',
        '/admin/activity-forum/topics/*/edit/*',
        '/admin/activity-forum/topics/view/*',
        '/admin/activity-forum/topics/status',
        '/admin/activity-forum/topics/delete',
        '/admin/activity-forum/topics/more',
        '/admin/activity-forum/topics/duplicate',

        /** announcement */
        '/admin/announcements',
        '/admin/announcements/list/*',
        '/admin/announcements/add',
        '/admin/announcements/*/edit/*',
        '/admin/announcements/*/edit/*/general',
        '/admin/announcements/view/*',
        '/admin/announcements/status',
        '/admin/announcements/delete',
        '/admin/announcements/more',
        '/admin/announcements/duplicate',
        '/admin/announcements/multi-select',
        '/admin/announcements/event',
        '/admin/announcements/general',

        /** transactions */
        '/admin/transactions/list/*',
        '/admin/transactions/view/*',

        /** chat */
        '/admin/user-management/users/view/chat/delete',
        '/admin/user-management/users/view/chat/action'
    ],
    /**Sub admin permissions */
    subAdmin: [
        /**Dashboard */
        '/admin/dashboard',

        /** admin->profile */
        '/admin/profile',
        '/admin/profile/edit/*',
        '/admin/profile/change-password/*',

        /**Users Management */
        '/admin/user-management',
        '/admin/user-management/users/list/*',
        '/admin/user-management/users/view/*',
        '/admin/user-management/users/*/edit/*',
        '/admin/user-management/users/delete',
        '/admin/user-management/users/add',
        '/admin/user-management/users/more',
        '/admin/user-management/users/subscribe',
        '/admin/user-management/users/status',
        '/admin/user-management/users/Invite_users',
        '/admin/user-management/users/assign_media',
        '/admin/user-management/users/duplicate',
        '/admin/user-management/users/export',

        /**Staff */
        '/admin/staff',
        '/admin/staff/list/*',
        '/admin/staff/add',
        '/admin/staff/*/edit/*',
        '/admin/staff/view/*',
        '/admin/staff/status',
        '/admin/staff/more',
        '/admin/staff/duplicate',
        '/admin/staff/resend',
        '/admin/staff/delete',
        '/admin/staff/invite',
        '/admin/staff/multi-select',

        /**cms */
        '/admin/cms',

        /** cms->portal design */
        '/admin/cms/portal-design',
        '/admin/cms/portal-design/submit',
        '/admin/cms/portal-design/reset',

        /** cms->pages */
        '/admin/cms/pages/list/*',
        '/admin/cms/pages/add',
        '/admin/cms/pages/*/edit/*',
        '/admin/cms/pages/view/*',
        '/admin/cms/pages/more',
        '/admin/cms/pages/duplicate',
        '/admin/cms/pages/delete',
        '/admin/cms/pages/status',
        '/admin/cms/pages/multi-select',

        /** cms->banner */
        '/admin/cms/banner/list/*',
        '/admin/cms/banner/add',
        '/admin/cms/banner/*/edit/*',
        '/admin/cms/banner/view/*',
        '/admin/cms/banner/more',
        '/admin/cms/banner/duplicate',
        '/admin/cms/banner/delete',
        '/admin/cms/banner/status',
        '/admin/cms/banner/multi-select',

        /** cms->automatic email template */
        '/admin/cms/default-email-template/list/*',
        '/admin/cms/default-email-template/view/*',
        '/admin/cms/default-email-template/add',
        '/admin/cms/default-email-template/*/edit/*',
        '/admin/cms/default-email-template/status',
        '/admin/cms/default-email-template/delete',
        '/admin/cms/default-email-template/more',
        '/admin/cms/default-email-template/preview',
        '/admin/cms/default-email-template/multi-select',

        /** cms->push notification template */
        '/admin/cms/push-notification-template/list/*',
        '/admin/cms/push-notification-template/view/*',
        '/admin/cms/push-notification-template/add',
        '/admin/cms/push-notification-template/*/edit/*',
        '/admin/cms/push-notification-template/status',
        '/admin/cms/push-notification-template/delete',
        '/admin/cms/push-notification-template/multi-select',

        /** cms->newsletter email template */
        '/admin/cms/promotional-email-templates/list/*',
        '/admin/cms/promotional-email-templates/add',
        '/admin/cms/promotional-email-templates/*/edit/*',
        '/admin/cms/promotional-email-templates/view/*',
        '/admin/cms/promotional-email-templates/delete',
        '/admin/cms/promotional-email-templates/more',
        '/admin/cms/promotional-email-templates/test',
        '/admin/cms/promotional-email-templates/preview',
        '/admin/cms/promotional-email-templates/duplicate',
        '/admin/cms/promotional-email-templates/status',
        '/admin/cms/promotional-email-templates/multi-select',

        /** cms->global settings */
        '/admin/cms/settings',
        '/admin/cms/settings/submit',


        /** cms->language files */
        '/admin/cms/language-files',
        '/admin/cms/language-files/frontend',
        '/admin/cms/language-files/backend',


        /** newsletters */
        '/admin/news-letter',
        '/admin/news-letter/list/*',
        '/admin/news-letter/add',
        '/admin/news-letter/*/edit/*',
        '/admin/news-letter/view/*/*',
        '/admin/news-letter/delete',
        '/admin/news-letter/more',
        '/admin/news-letter/resend',
        '/admin/news-letter/newsletter',
        '/admin/news-letter/multi-select',

        /** distribution list */
        '/admin/distribution-list/list/*',
        '/admin/distribution-list/add',
        '/admin/distribution-list/*/edit/*',
        '/admin/distribution-list/view/*',
        '/admin/distribution-list/view/*/*',
        '/admin/distribution-list/multi-select',
        '/admin/distribution-list/status',
        '/admin/distribution-list/delete',
        '/admin/distribution-list/users-list/list/delete',
        '/admin/distribution-list/users-list/list/add',
        '/admin/distribution-list/users/list/multi-select',



        /** media */
        '/admin/media',
        '/admin/media/add',
        '/admin/media/details',
        '/admin/media/delete',

        /** email logs */
        '/admin/email-logs',
        '/admin/email-logs/list/*',
        '/admin/email-logs/view/*',
        '/admin/email-logs/resend',

        /** event management */
        '/admin/event-management',
        '/admin/event-management/events/list/*',
        '/admin/event-management/events/add',
        '/admin/event-management/events/add/*',
        '/admin/event-management/events/add/hotels/*',
        '/admin/event-management/events/add/agenda/*',

        /** event management->edit */
        '/admin/event-management/events/edit',

        /** event management->edit->events */
        '/admin/event-management/events/edit/*',

        /** event management->edit->hotels */
        '/admin/event-management/events/edit/hotels/*/*',
        '/admin/event-management/events/edit/hotels/delete',

        /** event management->edit->agenda */
        '/admin/event-management/events/edit/agenda/*/*',
        '/admin/event-management/events/edit/agenda/delete',

        '/admin/event-management/events/view',
        '/admin/event-management/events/view/event/*',
        '/admin/event-management/events/view/hotels/*/*',
        '/admin/event-management/events/view/agenda/*/*',
        '/admin/event-management/events/view/registrations/*/*',

        /** event management->events->view->invitations */
        '/admin/event-management/events/view/invitations/*',
        '/admin/event-management/events/view/invitations/more',
        '/admin/event-management/events/view/invitations/delete',
        '/admin/event-management/events/view/invitations/resend',
        '/admin/event-management/events/view/invitations/send',
        '/admin/event-management/events/view/invitations/action',
        '/admin/event-management/events/view/invitations/multi-select',


        '/admin/event-management/events/view/attendees/*/*',

        '/admin/event-management/events/registration-edit-step-two',

        /** event management->announcements */
        '/admin/event-management/events/view/event-announcements/*/*',
        '/admin/event-management/events/view/event-announcements/delete',
        '/admin/event-management/events/view/event-announcements/button',
        '/admin/event-management/events/view/event-announcements/multi-select',

        '/admin/event-management/events/view/checkIn-checkOut/*/*',
        '/admin/event-management/events/view/*',
        '/admin/event-management/events/view/invoice/*',
        '/admin/event-management/events/registration-edit/*',
        '/admin/event-management/events/attendees/*',
        '/admin/event-management/events/delete',
        '/admin/event-management/events/more',
        '/admin/event-management/events/button',
        '/admin/event-management/events/multi-select',


        /** Questions set */
        '/admin/question-settings',
        '/admin/question-settings/sets/list/*',
        '/admin/question-settings/sets/add',
        '/admin/question-settings/sets/*/edit/*',
        '/admin/question-settings/sets/*/edit/*/question-set',
        '/admin/question-settings/sets/view/*',
        '/admin/question-settings/sets/status',
        '/admin/question-settings/sets/delete',
        // '/admin/question-settings/sets/delete/survey',
        // '/admin/question-settings/sets/more',
        // '/admin/question-settings/sets/reorder',
        // '/admin/question-settings/sets/newQuestions',
        // '/admin/question-settings/sets/duplicate',
        '/admin/question-settings/sets/multi-select',
        '/admin/question-settings/sets/question-set',
        '/admin/question-settings/sets/survey',
        '/admin/question-settings/sets/more/question-set',
        '/admin/question-settings/sets/reorder/question-set',
        '/admin/question-settings/sets/newQuestions/question-set',
        '/admin/question-settings/sets/duplicate/question-set',
        '/admin/question-settings/sets/delete/question-set',


        /** survey */
        '/admin/question-settings/questions/add',
        '/admin/question-settings/questions/*/edit/*',
        '/admin/question-settings/questions/view/*',
        '/admin/question-settings/questions/more',
        '/admin/question-settings/questions/duplicate',
        '/admin/question-settings/questions/delete',
        '/admin/question-settings/questions/status',

        /** activity forum */
        '/admin/activity-forum',
        '/admin/activity-forum/activities/list/*',
        '/admin/activity-forum/activities/add',
        '/admin/activity-forum/activities/*/edit/*',
        '/admin/activity-forum/activities/view/*',
        '/admin/activity-forum/activities/more',
        '/admin/activity-forum/activities/status',
        '/admin/activity-forum/activities/delete',
        '/admin/activity-forum/activities/duplicate',
        '/admin/activity-forum/activities/multi-select',

        /** topics */
        '/admin/activity-forum/topics/list/*',
        '/admin/activity-forum/topics/add',
        '/admin/activity-forum/topics/*/edit/*',
        '/admin/activity-forum/topics/view/*',
        '/admin/activity-forum/topics/status',
        '/admin/activity-forum/topics/delete',
        '/admin/activity-forum/topics/more',
        '/admin/activity-forum/topics/duplicate',

        /** announcement */
        '/admin/announcements',
        '/admin/announcements/list/*',
        '/admin/announcements/add',
        '/admin/announcements/*/edit/*',
        '/admin/announcements/*/edit/*/general',
        '/admin/announcements/view/*',
        '/admin/announcements/status',
        '/admin/announcements/delete',
        '/admin/announcements/more',
        '/admin/announcements/duplicate',
        '/admin/announcements/multi-select',
        '/admin/announcements/general',
        '/admin/announcements/event',

        /** transactions */
        '/admin/transactions/list/*',
        '/admin/transactions/view/*',

        /** chat */
        '/admin/user-management/users/view/chat/delete',
        '/admin/user-management/users/view/chat/action'
    ],
    /**Staff permissions */
    staff: [
        /**Dashboard */
        '/admin/dashboard',

        /** admin->profile */
        '/admin/profile',
        '/admin/profile/edit/*',
        '/admin/profile/change-password/*',

        /**Users Management */
        '/admin/user-management',
        '/admin/user-management/users/list/*',
        '/admin/user-management/users/view/*',
        '/admin/user-management/users/*/edit/*',
        '/admin/user-management/users/delete',
        '/admin/user-management/users/add',
        '/admin/user-management/users/more',
        '/admin/user-management/users/subscribe',
        '/admin/user-management/users/status',
        '/admin/user-management/users/Invite_users',
        '/admin/user-management/users/assign_media',
        '/admin/user-management/users/duplicate',
        '/admin/user-management/users/export',

        /**Staff */
        '/admin/staff',
        '/admin/staff/list/*',
        '/admin/staff/view/*',

        /**cms */
        '/admin/cms',


        /** cms->portal design */
        '/admin/cms/portal-design',

        /** cms->pages */
        '/admin/cms/pages/list/*',
        '/admin/cms/pages/view/*',

        /** cms->banner */
        '/admin/cms/banner/list/*',
        '/admin/cms/banner/view/*',

        /** cms->automatic email template */
        '/admin/cms/default-email-template/list/*',
        '/admin/cms/default-email-template/view/*',

        /** cms->push notification template */
        '/admin/cms/push-notification-template/list/*',
        '/admin/cms/push-notification-template/view/*',
        '/admin/cms/push-notification-template/add',
        // '/admin/cms/push-notification-template/*/edit/*',

        /** cms->newsletter email template */
        '/admin/cms/promotional-email-templates/list/*',
        '/admin/cms/promotional-email-templates/add',
        '/admin/cms/promotional-email-templates/*/edit/*',
        '/admin/cms/promotional-email-templates/view/*',
        '/admin/cms/promotional-email-templates/more',
        '/admin/cms/promotional-email-templates/test',
        '/admin/cms/promotional-email-templates/preview',
        '/admin/cms/promotional-email-templates/duplicate',
        '/admin/cms/promotional-email-templates/status',
        '/admin/cms/promotional-email-templates/multi-select',

        /** cms->global settings */
        '/admin/cms/settings',


        /** cms->language files */
        '/admin/cms/language-files',
        '/admin/cms/language-files/frontend',
        '/admin/cms/language-files/backend',



        /** newsletters */
        '/admin/news-letter',
        '/admin/news-letter/list/*',
        '/admin/news-letter/add',
        '/admin/news-letter/*/edit/*',
        '/admin/news-letter/view/*/*',
        '/admin/news-letter/more',
        '/admin/news-letter/resend',
        '/admin/news-letter/newsletter',


        /** distribution list */
        '/admin/distribution-list/list/*',
        '/admin/distribution-list/add',
        '/admin/distribution-list/*/edit/*',
        '/admin/distribution-list/view/*',
        '/admin/distribution-list/view/*/*',
        '/admin/distribution-list/multi-select',
        '/admin/distribution-list/status',
        '/admin/distribution-list/delete',
        '/admin/distribution-list/users-list/list/delete',
        '/admin/distribution-list/users-list/list/add',
        '/admin/distribution-list/users/list/multi-select',



        /** media */
        '/admin/media',
        '/admin/media/add',
        '/admin/media/details',


        /** email logs */
        '/admin/email-logs',
        '/admin/email-logs/list/*',
        '/admin/email-logs/view/*',
        '/admin/email-logs/resend',

        /** event management */
        '/admin/event-management',
        '/admin/event-management/events/list/*',
        '/admin/event-management/events/edit',
        '/admin/event-management/events/edit/*',
        '/admin/event-management/events/edit/hotels/*/*',
        '/admin/event-management/events/edit/agenda/*/*',
        '/admin/event-management/events/view',
        '/admin/event-management/events/view/event/*',
        '/admin/event-management/events/view/hotels/*/*',
        '/admin/event-management/events/view/agenda/*/*',
        '/admin/event-management/events/view/registrations/*/*',
        '/admin/event-management/events/view/invitations/*',
        '/admin/event-management/events/view/attendees/*/*',

        /** event management->announcements */
        '/admin/event-management/events/view/event-announcements/*/*',

        '/admin/event-management/events/registration-edit-step-two',

        '/admin/event-management/events/view/checkIn-checkOut/*/*',
        '/admin/event-management/events/view/*',
        '/admin/event-management/events/view/invoice/*',
        '/admin/event-management/events/registration-edit/*',
        '/admin/event-management/events/attendees/*',



        /** Questions set */
        '/admin/question-settings',
        '/admin/question-settings/sets/list/*',
        '/admin/question-settings/sets/view/*',
        // '/admin/question-settings/sets/survey',
        '/admin/question-settings/sets/*/edit/*',
        '/admin/question-settings/sets/add',
        '/admin/question-settings/sets/survey',


        /** survey */
        '/admin/question-settings/questions/add',
        // '/admin/question-settings/questions/*/edit/*',
        '/admin/question-settings/questions/view/*',
        '/admin/question-settings/questions/more',
        '/admin/question-settings/questions/status',
        '/admin/question-settings/questions/duplicate',

        /** activity forum */
        '/admin/activity-forum',
        '/admin/activity-forum/activities/list/*',
        '/admin/activity-forum/activities/view/*',

        /** topics */
        '/admin/activity-forum/topics/list/*',
        '/admin/activity-forum/topics/add',
        '/admin/activity-forum/topics/*/edit/*',
        '/admin/activity-forum/topics/view/*',
        '/admin/activity-forum/topics/status',
        '/admin/activity-forum/topics/more',
        '/admin/activity-forum/topics/duplicate',

        /** announcement */
        '/admin/announcements',
        '/admin/announcements/list/*',
        '/admin/announcements/add',
        '/admin/announcements/*/edit/*',
        '/admin/announcements/view/*',
        '/admin/announcements/more',
        '/admin/announcements/duplicate',
        '/admin/announcements/event',

        /** transactions */
        '/admin/transactions/list/*',
        '/admin/transactions/view/*',
    ],
};