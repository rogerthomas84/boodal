/**
 * Roger Thomas
 * GitHub - https://github.com/rogerthomas84/boodal
 */

let boodal = {
    _helpers: function() {
        /**
         * Generate a class name for a boodal modal
         *
         * @returns {string}
         * @private
         */
        this.genClass = function() {
            return 'boodal-modal';
        };

        /**
         * The default keys required for select, checkbox and radio elements.
         *
         * @returns {string[]}
         */
        this.multiRequired = function() {
            return ['title', 'body', 'options', 'ok.callback'];
        };

        /**
         * The default keys required for checkbox and radio elements.
         *
         * @returns {string[]}
         */
        this.inputRequired = function() {
            return ['title', 'body', 'ok.callback'];
        };

        /**
         *
         * @returns {{cancel: string, "modal.focus": boolean, "modal.backdrop": string, "ok.class": string, "cancel.callback": cancel.callback, "cancel.class": string, ok: string, "modal.close": boolean}}
         */
        this.confirmDefaults = function () {
            return {
                'ok': 'OK',
                'ok.class': 'btn-primary',
                'cancel': 'Cancel',
                'cancel.callback': function(){},
                'cancel.class': 'btn-light',
                'modal.backdrop': 'static',
                'modal.keyboard': false,
                'modal.focus': true,
                'modal.close': false,
                'modal-dialog.class': ''
            }
        };

        /**
         * The default key values for an alert dialog.
         *
         * @returns {{"modal.keyboard": boolean, "modal.focus": boolean, "modal.backdrop": string, "ok.callback": ok.callback, "ok.class": string, ok: string}}
         */
        this.alertDefaults = function() {
            return {
                'ok': 'OK',
                'ok.callback': function(){},
                'ok.class': 'btn-secondary',
                'modal.backdrop': 'static',
                'modal.keyboard': false,
                'modal.focus': true,
                'modal-dialog.class': ''
                //'modal.show': true // Hard coded for promptAlert and alert
            };
        };

        /**
         * Get the default values for a radio box.
         *
         * @returns {{val: null, cancel: string, "modal.focus": boolean, "modal.backdrop": string, "ok.class": string, "cancel.callback": cancel.callback, "cancel.class": string, placeholder: null, ok: string, "modal.close": boolean, attrs: {}}}
         */
        this.multiFromMultiDefaults = function() {
            let v = this.singleFromMultiDefaults();
            v['vals'] = null;
            delete v['val'];
            return v;
        };

        /**
         * Get the default values for an alert box.
         *
         * @returns {{val: null, cancel: string, "modal.focus": boolean, "modal.backdrop": string, "ok.class": string, "cancel.callback": cancel.callback, "cancel.class": string, placeholder: null, ok: string, "modal.close": boolean, attrs: {}}}
         */
        this.inputDefaults = function() {
            return this.singleFromMultiDefaults();
        };

        /**
         * Get the default key values for a single value from a multi list (select & radio)
         *
         * @returns {{val: null, cancel: string, "modal.focus": boolean, "modal.backdrop": string, "ok.class": string, "cancel.callback": cancel.callback, "cancel.class": string, placeholder: null, ok: string, "modal.close": boolean, attrs: {}}}
         */
        this.singleFromMultiDefaults = function() {
            return {
                'attrs': {},
                'val': null,
                'placeholder': null,
                'ok': 'OK',
                'ok.class': 'btn-primary',
                'cancel': 'Cancel',
                'cancel.callback': function(){},
                'cancel.class': 'btn-light',
                'maxLength': null,
                'modal.backdrop': 'static',
                //'modal.keyboard': false,
                'modal.focus': true,
                'modal.close': true,
                //'modal.show': true
                'modal.dialog.class': ''
            };
        };

        /**
         * Convert an array to an object for select, radio, checkbox.
         *
         * @param provided
         * @returns {*}
         */
        this.arrayToObjectForMulti = function (provided) {
            if (Array.isArray(provided) === false) {
                return provided;
            }
            let cleansed = {};
            for (let i=0;i<provided.length;i++) {
                cleansed[provided[i]] = provided[i]
            }
            return cleansed;
        };

        /**
         * Generate a unique identifier
         *
         * @returns {string}
         * @private
         */
        this.genId = function() {
            function S4() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }
            return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()).toLowerCase();
        };

        /**
         * Is a given value html?
         *
         * @param str {string}
         * @returns {boolean}
         * @private
         */
        this.isHtml = function(str) {
            let a = document.createElement('div');
            a.innerHTML = str;

            for (let c = a.childNodes, i = c.length; i--; ) {
                if (c[i].nodeType === 1) {
                    return true;
                }
            }

            return false;
        };

        /**
         * Checks for the existence of required keys and assigns defaults if necessary.
         *
         * @param provided {Object}
         * @param required {Array}
         * @param defaults {Object}
         * @returns {Object}
         * @private
         */
        this.requireKeys = function(provided, required, defaults) {
            for (let i=0;i<required.length;i++) {
                let v = provided[required[i]];
                if (typeof v === 'undefined' || v === null) {
                    throw 'boodal: Key of "' + required[i] + '" must be defined and cannot be empty';
                }
            }

            for (let k in defaults) {
                if (defaults.hasOwnProperty(k) === false) {
                    continue; // editor moans.
                }
                if (typeof provided[k] === 'undefined' || provided[k] === null) {
                    provided[k] = defaults[k];
                }
            }

            return provided;
        };

        /**
         * Passed the user assigned values, this method generated the construct values for a Bootstrap modal() call.
         *
         * @param provided {Object}
         * @returns {{keyboard: boolean, backdrop: boolean|string, show: boolean, focus: boolean}}
         */
        this.buildModalOpts = function(provided) {
            return {
                backdrop: provided['modal.backdrop'],
                keyboard: provided['modal.keyboard'],
                focus: provided['modal.focus'],
                show: provided['modal.show']
            }
        };

        /**
         * Clear all events from a boodal modal
         *
         * @param sel {string}
         */
        this.resetModalEvents = function(sel) {
            let el = $('.' + sel);
            $('button.close', el).off('click');
            el.off('hide.bs.modal');
            el.off('hidden.bs.modal');
            el.off('show.bs.modal');
            el.off('shown.bs.modal');
        };

        /**
         * Create a boodal modal and place it within the body of the document.
         *
         * @param modalClass {string}
         * @param title {string}
         * @param body {string}
         * @param okText {string}
         * @param cancelText {string}
         * @param okClass {string}
         * @param cancelClass {string}
         * @param closeBtn {boolean}
         * @param modalDialogClass {string}
         */
        this.boodalPlace = function(modalClass, title, body, okText, cancelText, okClass, cancelClass, closeBtn, modalDialogClass) {
            let o = this;
            let mm = $('<div />').addClass(modalClass).addClass('modal fade').attr('tabindex', '-1').attr('role', 'dialog');
            let md = $('<div />').addClass('modal-dialog').attr('role', 'document');
            if (typeof modalDialogClass !== 'undefined' && modalDialogClass.length > 0) {
                md.addClass(modalDialogClass);
            }
            let mc = $('<div />').addClass('modal-content');
            let mh = $('<div />').addClass('modal-header').html(
                $('<h5 />').addClass('modal-title').html(title)
            );
            if (closeBtn === true) {
                mh.append(
                    $('<button />').addClass('close').attr('type', 'button').attr('data-dismiss', 'modal').attr('aria-label', 'Close').html(
                        $('<span />').attr('aria-hidden', 'true').html('&times;')
                    )
                );
            }

            if (!o.isHtml(body)) {
                body = $('<p />').addClass('boodal-p').html(body);
            }
            mc.append(mh).append(
                $('<div />').addClass('modal-body').html(body)
            );

            let modalFooter = $('<div />').addClass('modal-footer pr-2 pt-2 pb-2 pl-2');
            if (okText !== null) {
                let pos = $('<button />').attr('type', 'button').addClass('btn boodal-ok').addClass(okClass).html(okText);
                modalFooter.append(pos);
            }
            if (cancelText !== null) {
                let neg = $('<button />').attr('type', 'button').addClass('btn').addClass('boodal-cancel').addClass(cancelClass).html(cancelText).attr('data-dismiss', 'modal');
                modalFooter.prepend(neg);
            }
            mc.append(modalFooter);
            md.append(mc);
            mm.append(md);
            $('body').append(mm);
        };

        /**
         * Build a generic input box of a given `inputType` type.
         *
         * @param opts {Object}
         * @param inputType
         */
        this.genericInput = function(opts, inputType) {
            let o = this;
            opts = o._helpers().requireKeys(
                opts,
                o.inputRequired(),
                o.inputDefaults()
            );
            opts['modal.keyboard'] = false;
            opts['modal.show'] = true;
            let sel = o.genClass();
            o.boodalPlace(sel, opts['title'], opts['body'], opts['ok'], opts['cancel'], opts['ok.class'], opts['cancel.class'], opts['modal.close'], opts['modal-dialog.class']);
            let el = $('.' + sel);
            let inputel;
            if (inputType === 'textarea') {
                if (typeof opts['rows'] === 'undefined') {
                    opts['rows'] = 4;
                }
                inputel = $('<textarea />').addClass('form-control mb-0').addClass('boodal-input').attr('rows', opts['rows']);
            } else {
                inputel = $('<input />').attr('type', inputType).addClass('form-control mb-0').addClass('boodal-input');
            }
            if (opts['val'] !== null) {
                inputel.val(opts['val']);
            }
            if (opts['placeholder'] !== null) {
                inputel.attr('placeholder', opts['placeholder']);
            }
            if (typeof opts['attrs']['class'] !== 'undefined') {
                inputel.addClass(opts['attrs']['class']);
            }
            if (typeof opts['attrs']['id'] !== 'undefined') {
                inputel.attr('id', opts['attrs']['id']);
            }
            if (typeof opts['attrs']['maxlength'] !== 'undefined') {
                opts['maxLength'] = opts['attrs']['maxlength'];
            }
            if (opts['maxLength'] !== null) {
                opts['attrs']['maxlength'] = opts['maxLength'];
            }
            for (let attrK in opts['attrs']) {
                if (opts['attrs'].hasOwnProperty(attrK) === false) {
                    continue;
                }
                if (attrK !== 'id' && attrK !== 'class' && attrK !== 'maxlength') {
                    inputel.attr(attrK, opts['attrs'][attrK]);
                }
            }
            let hasMaxLength = false;
            if (typeof opts['maxLength'] !== 'undefined' && opts['maxLength'] !== null) {
                inputel.attr('maxlength', opts['maxLength']);
                hasMaxLength = true;
            }
            $('.modal-body', el).append(inputel);
            if (hasMaxLength === true) {
                inputel.after('<span class="badge rounded-bottom badge-primary float-right mr-1 mt-1 boodalCharCounter">0 / ' + opts['maxLength'] + '</span>');
            }
            if (hasMaxLength === true) {
                inputel.off('keyup').on('keyup', function(){
                    let counter = $('.boodalCharCounter');
                    counter.html(String(inputel.val().length) + ' / ' + opts['maxLength']);
                    if (inputel.val().length > opts['maxLength']) {
                        counter.addClass('badge-danger');
                        counter.removeClass('badge-primary');
                        counter.removeClass('badge-success');
                    } else if (inputel.val().length === opts['maxLength']) {
                        counter.addClass('badge-success');
                        counter.removeClass('badge-primary');
                        counter.removeClass('badge-danger');
                    } else {
                        counter.addClass('badge-primary');
                        counter.removeClass('badge-danger');
                        counter.removeClass('badge-success');
                    }
                });
            }
            let input;
            if (inputType === 'textarea') {
                input = $('.modal-body textarea.boodal-input', el);
            } else {
                input = $('.modal-body input.boodal-input', el);
            }
            el.on('shown.bs.modal', function(e){
                input.focus();
            });
            el.modal(o.buildModalOpts(opts));
            o.resetModalEvents(sel);
            $('button.close', el).on('click', function(){
                opts['ok.callback'] = function () {};
                inputel.off('keyup');
                $('.boodal-cancel', el).click();
            });
            el.on('hide.bs.modal', function(e){
                inputel.off('keyup');
            });
            el.on('hidden.bs.modal', function(){
                o.resetModalEvents(sel);
                let val = input.val();
                if (typeof val === 'undefined') {
                    val = null;
                } else if (val.length === 0) {
                    val = null;
                }
                $('.' + sel).remove();
                inputel.off('keyup');
                opts['ok.callback'](val);
            });
            $('.boodal-ok', el).on('click', function(e){
                e.preventDefault();
                $('.' + sel).modal('hide');
            });
            $('.boodal-cancel', el).on('click', function(e){
                e.preventDefault();
                el.off('hide.bs.modal');
                el.off('hidden.bs.modal');
                el.on('hidden.bs.modal', function(){
                    $('.' + sel).remove();
                    opts['cancel.callback']();
                    o._helpers().resetModalEvents(sel);
                });
                el.modal('hide');
            });
            inputel.trigger('keyup');
        };

        return this;
    },
    alert: function(opts) {
        let o = this;
        opts = o._helpers().requireKeys(
            opts,
            ['title', 'body'],
            o._helpers().alertDefaults()
        );
        opts['modal.show'] = true;
        opts['cancel.callback'] = function(){};
        let sel = o._helpers().genClass();
        o._helpers().boodalPlace(sel, opts['title'], opts['body'], opts['ok'], null, opts['ok.class'], null, false, opts['modal-dialog.class']);
        let el = $('.' + sel);
        el.modal(o._helpers().buildModalOpts(opts));
        o._helpers().resetModalEvents(sel);
        el.on('hide.bs.modal', function(){
        });
        el.on('hidden.bs.modal', function(){
            o._helpers().resetModalEvents(sel);
            $('.' + sel).remove();
            opts['ok.callback']();
        });
        $('.boodal-ok', el).on('click', function(e){
            e.preventDefault();
            $('.' + sel).modal('hide');
        });
    },
    confirm: function(opts) {
        let o = this;
        opts = o._helpers().requireKeys(
            opts,
            ['title', 'body', 'ok.callback'],
            o._helpers().confirmDefaults()
        );
        opts['modal.show'] = true;
        opts['modal.close'] = false;
        opts['modal.keyboard'] = false;
        let sel = o._helpers().genClass();
        o._helpers().boodalPlace(sel, opts['title'], opts['body'], opts['ok'], opts['cancel'], opts['ok.class'], opts['cancel.class'], opts['modal.close'], opts['modal-dialog.class']);
        let el = $('.' + sel);
        el.modal(o._helpers().buildModalOpts(opts));
        o._helpers().resetModalEvents(sel);
        el.on('hide.bs.modal', function(){
        });
        el.on('hidden.bs.modal', function(){
            o._helpers().resetModalEvents(sel);
            $('.' + sel).remove();
            opts['ok.callback']();
        });
        $('.boodal-ok', el).on('click', function(e){
            e.preventDefault();
            $('.' + sel).modal('hide');
        });
        $('.boodal-cancel', el).on('click', function(e){
            e.preventDefault();
            el.off('hide.bs.modal');
            el.off('hidden.bs.modal');
            el.on('hidden.bs.modal', function() {
                $('.' + sel).remove();
                opts['cancel.callback']();
                o._helpers().resetModalEvents(sel);
            });
            $('.' + sel).modal('hide');
        });
    },
    select: function(opts) {
        let o = this;
        opts = o._helpers().requireKeys(
            opts,
            o._helpers().multiRequired(),
            o._helpers().singleFromMultiDefaults()
        );
        opts['modal.keyboard'] = false;
        opts['modal.show'] = true;
        let sel = o._helpers().genClass();
        o._helpers().boodalPlace(sel, opts['title'], opts['body'], opts['ok'], opts['cancel'], opts['ok.class'], opts['cancel.class'], opts['modal.close'], opts['modal-dialog.class']);
        let el = $('.' + sel);
        let selEl = $('<select />').addClass('custom-select').addClass('boodal-select');
        if (opts['placeholder'] !== null) {
            selEl.append(
                $('<option />').prop('disabled', true).prop('selected', true).html(opts['placeholder'])
            );
        }
        if (typeof opts['attrs']['class'] !== 'undefined') {
            selEl.addClass(opts['attrs']['class']);
        }
        if (typeof opts['attrs']['id'] !== 'undefined') {
            selEl.attr('id', opts['attrs']['id']);
        }

        let possibles = o._helpers().arrayToObjectForMulti(opts['options']);
        for (let optK in possibles) {
            if (possibles.hasOwnProperty(optK) === false) {
                continue;
            }
            let anOpt = $('<option />').attr('value', optK).html(possibles[optK]);
            if (opts['val'] === optK) {
                anOpt.prop('selected', true);
            }
            selEl.append(anOpt);
        }

        if (opts['val'] !== null) {
            $('option[value="' + opts['val'] + '"]', selEl).prop('selected', true);
        }
        $('.modal-body', el).append(selEl);
        let select = $('.modal-body select.boodal-select', el);
        el.on('shown.bs.modal', function(e){
            select.focus();
        });
        el.modal(o._helpers().buildModalOpts(opts));
        o._helpers().resetModalEvents(sel);
        $('button.close', el).on('click', function(){
            opts['ok.callback'] = function () {};
            $('.boodal-cancel', el).click();
        });
        el.on('hide.bs.modal', function(){
        });
        el.on('hidden.bs.modal', function(){
            o._helpers().resetModalEvents(sel);
            let val = $('option:selected', select).attr('value');
            if (typeof val === 'undefined') {
                val = null;
            } else if (val.length === 0) {
                val = null;
            }
            $('.' + sel).remove();
            opts['ok.callback'](val);
        });
        $('.boodal-ok', el).on('click', function(e){
            e.preventDefault();
            $('.' + sel).modal('hide');
        });
        $('.boodal-cancel', el).on('click', function(e){
            e.preventDefault();
            el.off('hide.bs.modal');
            el.off('hidden.bs.modal');
            el.on('hidden.bs.modal', function(){
                $('.' + sel).remove();
                opts['cancel.callback']();
                o._helpers().resetModalEvents(sel);
            });
            el.modal('hide');
        });
    },
    checkbox: function(opts) {
        let o = this;
        opts = o._helpers().requireKeys(
            opts,
            o._helpers().multiRequired(),
            o._helpers().multiFromMultiDefaults()
        );

        if (!Array.isArray(opts['vals'])) {
            opts['vals'] = [];
        }

        opts['modal.keyboard'] = false;
        opts['modal.show'] = true;
        let sel = o._helpers().genClass();
        o._helpers().boodalPlace(sel, opts['title'], opts['body'], opts['ok'], opts['cancel'], opts['ok.class'], opts['cancel.class'], opts['modal.close'], opts['modal-dialog.class']);
        let el = $('.' + sel);

        let possibles = o._helpers().arrayToObjectForMulti(opts['options']);
        for (let optK in possibles) {
            if (possibles.hasOwnProperty(optK) === false) {
                continue;
            }
            let checkId = 'boodalCheck' + o._helpers().genId();
            let anOptCase = $('<div />').addClass('form-check');
            let anOptCheck = $('<input />').addClass(
                'form-check-input'
            ).addClass(
                'boodal-check'
            ).attr(
                'type',
                'checkbox'
            ).attr(
                'value', optK
            ).attr(
                'id',
                checkId
            );
            if (typeof opts['attrs']['class'] !== 'undefined') {
                anOptCheck.addClass(opts['attrs']['class']);
            }
            if (opts['vals'].indexOf(optK) !== -1) {
                anOptCheck.prop('checked', true);
            }
            anOptCase.append(
                anOptCheck
            ).append(
                $('<label />').addClass('form-check-label').attr('for', checkId).html(possibles[optK])
            );
            $('.modal-body', el).append(anOptCase);
        }

        el.modal(o._helpers().buildModalOpts(opts));
        o._helpers().resetModalEvents(sel);
        $('button.close', el).on('click', function(){
            opts['ok.callback'] = function () {};
            $('.boodal-cancel', el).click();
        });
        el.on('hide.bs.modal', function(){
        });
        el.on('hidden.bs.modal', function(){
            o._helpers().resetModalEvents(sel);
            let checked = [];
            let elems = $('.boodal-check', $('.modal-body', el));
            for (let i=0;i<elems.length;i++) {
                let e = $(elems[i]);
                if (e.is(':checked')) {
                    checked.push(e.attr('value'));
                }
            }
            if (checked.length === 0) {
                checked = null;
            }
            $('.' + sel).remove();
            opts['ok.callback'](checked);
        });
        $('.boodal-ok', el).on('click', function(e){
            e.preventDefault();
            $('.' + sel).modal('hide');
        });
        $('.boodal-cancel', el).on('click', function(e){
            e.preventDefault();
            el.off('hide.bs.modal');
            el.off('hidden.bs.modal');
            el.on('hidden.bs.modal', function(){
                $('.' + sel).remove();
                opts['cancel.callback']();
                o._helpers().resetModalEvents(sel);
            });
            el.modal('hide');
        });
    },
    radio: function(opts) {
        let o = this;
        opts = o._helpers().requireKeys(
            opts,
            o._helpers().multiRequired(),
            o._helpers().singleFromMultiDefaults()
        );
        opts['modal.keyboard'] = false;
        opts['modal.show'] = true;
        let sel = o._helpers().genClass();
        o._helpers().boodalPlace(sel, opts['title'], opts['body'], opts['ok'], opts['cancel'], opts['ok.class'], opts['cancel.class'], opts['modal.close'], opts['modal-dialog.class']);
        let el = $('.' + sel);
        let radioName = 'boodalRadio' + o._helpers().genId();
        let possibles = o._helpers().arrayToObjectForMulti(opts['options']);

        let hasDef = false;
        for (let optK in possibles) {
            if (possibles.hasOwnProperty(optK) === false) {
                continue;
            }
            let radioId = 'boodalCheck' + o._helpers().genId();
            let anOptCase = $('<div />').addClass('form-check');
            let anOptRadio = $('<input />').addClass(
                'form-check-input'
            ).addClass(
                'boodal-radio'
            ).attr(
                'type',
                'radio'
            ).attr(
                'value', optK
            ).attr(
                'id',
                radioId
            ).attr(
                'name',
                radioName
            );
            if (typeof opts['attrs']['class'] !== 'undefined') {
                anOptRadio.addClass(opts['attrs']['class']);
            }
            if (opts['val'] === optK || opts['val'] === null) {
                if (hasDef === false) {
                    anOptRadio.prop('checked', true);
                    hasDef = true;
                }
            }
            anOptCase.append(
                anOptRadio
            ).append(
                $('<label />').addClass('form-check-label').attr('for', radioId).html(possibles[optK])
            );
            $('.modal-body', el).append(anOptCase);
        }

        el.modal(o._helpers().buildModalOpts(opts));
        o._helpers().resetModalEvents(sel);
        $('button.close', el).on('click', function(){
            opts['ok.callback'] = function () {};
            $('.boodal-cancel', el).click();
        });
        el.on('hide.bs.modal', function(e){
        });
        el.on('hidden.bs.modal', function(){
            o._helpers().resetModalEvents(sel);
            let val = $('.boodal-radio:checked', $('.modal-body', el)).attr('value');
            if (typeof val === 'undefined') {
                val = null;
            } else if (val.length === 0) {
                val = null;
            }
            $('.' + sel).remove();
            opts['ok.callback'](val);
        });
        $('.boodal-ok', el).on('click', function(e){
            e.preventDefault();
            $('.' + sel).modal('hide');
        });
        $('.boodal-cancel', el).on('click', function(e){
            e.preventDefault();
            el.off('hide.bs.modal');
            el.off('hidden.bs.modal');
            el.on('hidden.bs.modal', function(){
                $('.' + sel).remove();
                opts['cancel.callback']();
                o._helpers().resetModalEvents(sel);
            });
            el.modal('hide');
        });
    },
    text: function(opts) {
        let o = this;
        o._helpers().genericInput(opts, 'text');
    },
    textarea: function(opts) {
        let o = this;
        o._helpers().genericInput(opts, 'textarea');
    },
    email: function(opts) {
        let o = this;
        o._helpers().genericInput(opts, 'email');
    },
    number: function(opts) {
        let o = this;
        o._helpers().genericInput(opts, 'number');
    }
};