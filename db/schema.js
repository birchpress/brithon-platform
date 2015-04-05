'use strict';

'use strict';

var schema = {
    schema_meta: {
        meta_id: {
            type: 'increments',
            nullable: false,
            primary: true
        },
        meta_key: {
            type: 'string',
            maxlength: 255,
            nullable: false
        },
        meta_value: {
            type: 'text',
            fieldtype: 'mediumtext'
        }
    },

    account: {
        id: {
            type: 'increments',
            nullable: false,
            primary: true
        },

        name: {
            type: 'string',
            maxlength: 127,
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
            maxlength: 255,
            nullable: false
        },

        email: {
            type: 'string',
            maxlength: 255,
            nullable: false,
            unique: true
        },

        name: {
            type: 'string',
            maxlength: 127,
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

        owner_id: {
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
