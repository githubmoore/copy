/* ----------------------------------------------------------------------------
 * Easy!Appointments - Open Source Web Scheduler
 *
 * @package     EasyAppointments
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2020, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://easyappointments.org
 * @since       v1.5.0
 * ---------------------------------------------------------------------------- */

window.App.Http.Secretaries = (function () {
    /**
     * Create an secretary.
     *
     * @param {Object} secretary
     *
     * @return {jQuery.Deferred}
     */
    function create(secretary) {
        const url = App.Utils.Url.siteUrl('secretaries/create');

        const data = {
            csrf_token: App.Config.csrf_token,
            secretary: secretary
        };

        return $.post(url, data);
    }

    /**
     * Update an secretary.
     *
     * @param {Object} secretary
     *
     * @return {jQuery.Deferred}
     */
    function update(secretary) {
        const url = App.Utils.Url.siteUrl('secretaries/update');

        const data = {
            csrf_token: App.Config.csrf_token,
            secretary: secretary
        };

        return $.post(url, data);
    }

    /**
     * Delete an secretary.
     *
     * @param {Number} secretaryId
     *
     * @return {jQuery.Deferred}
     */
    function destroy(secretaryId) {
        const url = App.Utils.Url.siteUrl('secretaries/destroy');

        const data = {
            csrf_token: App.Config.csrf_token,
            secretary_id: secretaryId
        };

        return $.post(url, data);
    }

    /**
     * Search secretaries by keyword.
     *
     * @param {String} keyword
     * @param {Number} limit
     * @param {Number} offset
     * @param {String} orderBy
     *
     * @return {jQuery.Deferred}
     */
    function search(keyword, limit, offset, orderBy) {
        const url = App.Utils.Url.siteUrl('secretaries/search');

        const data = {
            csrf_token: App.Config.csrf_token,
            keyword,
            limit,
            offset,
            order_by: orderBy
        };

        return $.post(url, data);
    }

    /**
     * Find an secretary.
     *
     * @param {Number} secretaryId
     *
     * @return {jQuery.Deferred}
     */
    function find(secretaryId) {
        const url = App.Utils.Url.siteUrl('secretaries/find');

        const data = {
            csrf_token: App.Config.csrf_token,
            secretary_id: secretaryId
        };

        return $.post(url, data);
    }

    return {
        create,
        update,
        destroy,
        search,
        find
    };
})();
