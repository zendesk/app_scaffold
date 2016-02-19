import LegacyApp from './app';
import MigrationHelper from './migration_helper';
import ZAFClient from 'zendesk_app_framework_sdk';

var client = ZAFClient.init();
new MigrationHelper(client, LegacyApp);
