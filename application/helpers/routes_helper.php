<?php defined('BASEPATH') or exit('No direct script access allowed');

/* ----------------------------------------------------------------------------
 * Easy!Appointments - Open Source Web Scheduler
 *
 * @package     EasyAppointments
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) 2013 - 2020, Alex Tselegidis
 * @license     http://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        http://easyappointments.org
 * @since       v1.3.0
 * ---------------------------------------------------------------------------- */

if ( ! function_exists('route_api_resource'))
{
    /**
     * Define a route for an API resource (includes index, store, update and delete callbacks).
     *
     * @param array $route Route config.
     * @param string $resource Resource name.
     * @param string|null $prefix URL prefix (e.g. api/v1/).
     */
    function route_api_resource(array &$route, string $resource, string $prefix = '')
    {
        $route[$prefix . $resource]['post'] = 'api/v1/' . $resource . '_api_v1/store';
        $route[$prefix . $resource . '/(:num)']['put'] = 'api/v1/' . $resource . '_api_v1/update/$1';
        $route[$prefix . $resource . '/(:num)']['delete'] = 'api/v1/' . $resource . '_api_v1/destroy/$1';
        $route[$prefix . $resource]['get'] = 'api/v1/' . $resource . '_api_v1/index';
        $route[$prefix . $resource . '/(:num)']['get'] = 'api/v1/' . $resource . '_api_v1/show/$1';
    }
}
