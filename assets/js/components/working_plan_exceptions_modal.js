$(function () {
    'use strict';

    var $modal = $('#working-plan-exceptions-modal');
    var $date = $('#working-plan-exceptions-date');
    var $start = $('#working-plan-exceptions-start');
    var $end = $('#working-plan-exceptions-end');
    var $breaks = $('#working-plan-exceptions-breaks');
    var $save = $('#working-plan-exceptions-save');
    var deferred = null;
    var enableSubmit = false;
    var enableCancel = false;

    function resetModal() {
        $date.val('');
        $start.val('');
        $end.val('');
        $breaks.find('tbody').empty();
    }

    function validate() {
        $modal.find('.is-invalid').removeClass('is-invalid');

        var date = $date.datepicker('getDate');

        if (!date) {
            $date.addClass('is-invalid');
        }

        var start = $start.timepicker('getDate');

        if (!start) {
            $start.addClass('is-invalid');
        }

        var end = $end.timepicker('getDate');

        if (!end) {
            $end.addClass('is-invalid');
        }

        return !$modal.find('.is-invalid').length;
    }

    function onModalHidden() {
        resetModal();
    }

    function getBreaks() {
        var breaks = [];

        $breaks.find('tbody tr').each(function (index, tr) {
            var $tr = $(tr);

            if ($tr.find('input:text').length) {
                return true;
            }

            var start = $tr.find('.working-plan-exceptions-break-start').text();
            var end = $tr.find('.working-plan-exceptions-break-end').text();

            breaks.push({
                start: moment(start, GlobalVariables.timeFormat === 'regular' ? 'h:mm a' : 'HH:mm').format('HH:mm'),
                end: moment(end, GlobalVariables.timeFormat === 'regular' ? 'h:mm a' : 'HH:mm').format('HH:mm')
            });
        });

        // Sort breaks increasingly by hour within day
        breaks.sort(function (break1, break2) {
            // We can do a direct string comparison since we have time based on 24 hours clock.
            return break1.start.localeCompare(break2.start);
        });

        return breaks;
    }

    function onSaveClick() {
        if (!deferred) {
            return;
        }

        if (!validate()) {
            return;
        }

        var date = moment($date.datepicker('getDate')).format('YYYY-MM-DD');

        var workingPlanException = {
            start: moment($start.datetimepicker('getDate')).format('HH:mm'),
            end: moment($end.datetimepicker('getDate')).format('HH:mm'),
            breaks: getBreaks()
        };

        deferred.resolve(date, workingPlanException);

        $modal.modal('hide');
        resetModal();
    }

    function editableTimeCell($target) {
        $target.editable(
            function (value) {
                // Do not return the value because the user needs to press the "Save" button.
                return value;
            },
            {
                event: 'edit',
                height: '30px',
                submit: $('<button/>', {
                    'type': 'button',
                    'class': 'd-none submit-editable',
                    'text': App.Lang.save
                }).get(0).outerHTML,
                cancel: $('<button/>', {
                    'type': 'button',
                    'class': 'd-none cancel-editable',
                    'text': App.Lang.cancel
                }).get(0).outerHTML,
                onblur: 'ignore',
                onreset: function () {
                    if (!enableCancel) {
                        return false; // disable ESC button
                    }
                },
                onsubmit: function () {
                    if (!enableSubmit) {
                        return false; // disable Enter button
                    }
                }
            }
        );
    }

    function add() {
        deferred = jQuery.Deferred();

        $date.datepicker('setDate', new Date());
        $start.timepicker('setDate', moment('08:00', 'HH:mm').toDate());
        $end.timepicker('setDate', moment('20:00', 'HH:mm').toDate());

        $modal.modal('show');

        return deferred.promise();
    }

    function edit(date, workingPlanException) {
        deferred = jQuery.Deferred();

        $date.datepicker('setDate', moment(date, 'YYYY-MM-DD').toDate());
        $start.timepicker('setDate', moment(workingPlanException.start, 'HH:mm').toDate());
        $end.timepicker('setDate', moment(workingPlanException.end, 'HH:mm').toDate());

        workingPlanException.breaks.forEach(function (workingPlanExceptionBreak) {
            renderBreakRow(workingPlanExceptionBreak).appendTo($breaks.find('tbody'));
        });

        editableTimeCell(
            $breaks.find('tbody .working-plan-exceptions-break-start, tbody .working-plan-exceptions-break-end')
        );

        $modal.modal('show');

        return deferred.promise();
    }

    function renderBreakRow(breakPeriod) {
        var timeFormat = GlobalVariables.timeFormat === 'regular' ? 'h:mm a' : 'HH:mm';

        return $('<tr/>', {
            'html': [
                $('<td/>', {
                    'class': 'working-plan-exceptions-break-start editable',
                    'text': moment(breakPeriod.start, 'HH:mm').format(timeFormat)
                }),
                $('<td/>', {
                    'class': 'working-plan-exceptions-break-end editable',
                    'text': moment(breakPeriod.end, 'HH:mm').format(timeFormat)
                }),
                $('<td/>', {
                    'html': [
                        $('<button/>', {
                            'type': 'button',
                            'class': 'btn btn-outline-secondary btn-sm me-2 working-plan-exceptions-edit-break',
                            'title': App.Lang.edit,
                            'html': [
                                $('<span/>', {
                                    'class': 'fas fa-edit'
                                })
                            ]
                        }),
                        $('<button/>', {
                            'type': 'button',
                            'class': 'btn btn-outline-secondary btn-sm working-plan-exceptions-delete-break',
                            'title': App.Lang.delete,
                            'html': [
                                $('<span/>', {
                                    'class': 'fas fa-trash-alt'
                                })
                            ]
                        }),
                        $('<button/>', {
                            'type': 'button',
                            'class': 'btn btn-outline-secondary btn-sm me-2 working-plan-exceptions-save-break d-none',
                            'title': App.Lang.save,
                            'html': [
                                $('<span/>', {
                                    'class': 'fas fa-check-circle'
                                })
                            ]
                        }),
                        $('<button/>', {
                            'type': 'button',
                            'class': 'btn btn-outline-secondary btn-sm working-plan-exceptions-cancel-break d-none',
                            'title': App.Lang.cancel,
                            'html': [
                                $('<span/>', {
                                    'class': 'fas fa-ban'
                                })
                            ]
                        })
                    ]
                })
            ]
        });
    }

    function onAddBreakClick() {
        var $newBreak = renderBreakRow({
            start: '12:00',
            end: '14:00'
        }).appendTo('#working-plan-exceptions-breaks tbody');

        // Bind editable and event handlers.
        editableTimeCell($newBreak.find('.working-plan-exceptions-break-start, .working-plan-exceptions-break-end'));
        $newBreak.find('.working-plan-exceptions-edit-break').trigger('click');
        $('.working-plan-exceptions-add-break').prop('disabled', true);
    }

    function onEditBreakClick() {
        // Reset previous editable table cells.
        var $previousEdits = $(this).closest('table').find('.editable');

        $previousEdits.each(function (index, editable) {
            if (editable.reset) {
                editable.reset();
            }
        });

        // Make all cells in current row editable.
        var $tr = $(this).closest('tr');
        $tr.children().trigger('edit');
        initializeTimepicker(
            $tr.find('.working-plan-exceptions-break-start input, .working-plan-exceptions-break-end input')
        );
        $(this).closest('tr').find('.working-plan-exceptions-break-start').focus();

        // Show save - cancel buttons.
        $tr = $(this).closest('tr');
        $tr.find('.working-plan-exceptions-edit-break, .working-plan-exceptions-delete-break').addClass('d-none');
        $tr.find('.working-plan-exceptions-save-break, .working-plan-exceptions-cancel-break').removeClass('d-none');
        $tr.find('select,input:text').addClass('form-control input-sm');

        $('.working-plan-exceptions-add-break').prop('disabled', true);
    }

    function onDeleteBreakClick() {
        $(this).closest('tr').remove();
    }

    function onSaveBreakClick() {
        // Break's start time must always be prior to break's end.
        var $tr = $(this).closest('tr');
        var start = moment(
            $tr.find('.working-plan-exceptions-break-start input').val(),
            GlobalVariables.timeFormat === 'regular' ? 'h:mm a' : 'HH:mm'
        );
        var end = moment(
            $tr.find('.working-plan-exceptions-break-end input').val(),
            GlobalVariables.timeFormat === 'regular' ? 'h:mm a' : 'HH:mm'
        );

        if (start > end) {
            $tr.find('.working-plan-exceptions-break-end input').val(
                start.add(1, 'hour').format(GlobalVariables.timeFormat === 'regular' ? 'h:mm a' : 'HH:mm')
            );
        }

        enableSubmit = true;
        $tr.find('.editable .submit-editable').trigger('click');
        enableSubmit = false;

        $tr.find('.working-plan-exceptions-save-break, .working-plan-exceptions-cancel-break').addClass('d-none');
        $tr.closest('table')
            .find('.working-plan-exceptions-edit-break, .working-plan-exceptions-delete-break')
            .removeClass('d-none');
        $('.working-plan-exceptions-add-break').prop('disabled', false);
    }

    function onCancelBreakClick() {
        var $tr = $(this).closest('tr');
        enableCancel = true;
        $tr.find('.cancel-editable').trigger('click');
        enableCancel = false;

        $breaks
            .find('.working-plan-exceptions-edit-break, .working-plan-exceptions-delete-break')
            .removeClass('d-none');
        $tr.find('.working-plan-exceptions-save-break, .working-plan-exceptions-cancel-break').addClass('d-none');
        $('.working-plan-exceptions-add-break').prop('disabled', false);
    }

    function initializeDatepicker($target) {
        var dateFormat;

        switch (GlobalVariables.dateFormat) {
            case 'DMY':
                dateFormat = 'dd/mm/yy';
                break;

            case 'MDY':
                dateFormat = 'mm/dd/yy';
                break;

            case 'YMD':
                dateFormat = 'yy/mm/dd';
                break;

            default:
                throw new Error('Invalid date format setting provided: ' + GlobalVariables.dateFormat);
        }

        $target.datepicker({
            dateFormat: dateFormat,
            firstDay: GeneralFunctions.getWeekDayId(GlobalVariables.firstWeekday),
            minDate: 0,
            defaultDate: moment().toDate(),
            dayNames: [
                App.Lang.sunday,
                App.Lang.monday,
                App.Lang.tuesday,
                App.Lang.wednesday,
                App.Lang.thursday,
                App.Lang.friday,
                App.Lang.saturday
            ],
            dayNamesShort: [
                App.Lang.sunday.substr(0, 3),
                App.Lang.monday.substr(0, 3),
                App.Lang.tuesday.substr(0, 3),
                App.Lang.wednesday.substr(0, 3),
                App.Lang.thursday.substr(0, 3),
                App.Lang.friday.substr(0, 3),
                App.Lang.saturday.substr(0, 3)
            ],
            dayNamesMin: [
                App.Lang.sunday.substr(0, 2),
                App.Lang.monday.substr(0, 2),
                App.Lang.tuesday.substr(0, 2),
                App.Lang.wednesday.substr(0, 2),
                App.Lang.thursday.substr(0, 2),
                App.Lang.friday.substr(0, 2),
                App.Lang.saturday.substr(0, 2)
            ],
            monthNames: [
                App.Lang.january,
                App.Lang.february,
                App.Lang.march,
                App.Lang.april,
                App.Lang.may,
                App.Lang.june,
                App.Lang.july,
                App.Lang.august,
                App.Lang.september,
                App.Lang.october,
                App.Lang.november,
                App.Lang.december
            ],
            prevText: App.Lang.previous,
            nextText: App.Lang.next,
            currentText: App.Lang.now,
            closeText: App.Lang.close
        });
    }

    function initializeTimepicker($target) {
        $target.timepicker({
            timeFormat: GlobalVariables.timeFormat === 'regular' ? 'h:mm tt' : 'HH:mm',
            currentText: App.Lang.now,
            closeText: App.Lang.close,
            timeOnlyTitle: App.Lang.select_time,
            timeText: App.Lang.time,
            hourText: App.Lang.hour,
            minuteText: App.Lang.minutes
        });
    }

    initializeDatepicker($date);
    initializeTimepicker($start);
    initializeTimepicker($end);

    $modal
        .on('hidden.bs.modal', onModalHidden)
        .on('click', '.working-plan-exceptions-add-break', onAddBreakClick)
        .on('click', '.working-plan-exceptions-edit-break', onEditBreakClick)
        .on('click', '.working-plan-exceptions-delete-break', onDeleteBreakClick)
        .on('click', '.working-plan-exceptions-save-break', onSaveBreakClick)
        .on('click', '.working-plan-exceptions-cancel-break', onCancelBreakClick);

    $save.on('click', onSaveClick);

    window.WorkingPlanExceptionsModal = {
        add: add,
        edit: edit
    };
});
