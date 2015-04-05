'use strict';

'use strict';

var schema = {
    account: {
        id: {
            type: 'increments',
            nullable: false,
            primary: true
        },

        name: {
            type: 'string',
            maxlength: 150,
            nullable: false
        }
    },

    user: {
        id: {
            type: 'increments',
            nullable: false,
            primary: true
        },

        password: {
            type: 'string',
            maxlength: 256,
            nullable: false
        },

        email: {
            type: 'string',
            maxlength: 254,
            nullable: false,
            unique: true
        },

        name: {
            type: 'string',
            maxlength: 150,
            nullable: false
        },

        created_at: {
            type: 'dateTime',
            nullable: false
        },

        updated_at: {
            type: 'dateTime',
            nullable: true
        }
    },

    account_owner: {
        account_id: {
            type: 'integer',
            unsigned: true,
            nullable: false
        },

        user_id: {
            type: 'integer',
            unsigned: true,
            nullable: false
        }
    },

    user_account: {
        user_id: {
            type: 'integer',
            unsigned: true,
            nullable: false
        },

        account_id: {
            type: 'integer',
            unsigned: true,
            nullable: false
        }
    }
};

module.exports = schema;
