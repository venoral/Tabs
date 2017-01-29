import './app.scss';
import $ from 'jquery';
import EventEmitter from 'events';

const Selector = (classPrefix) => ({
	PREFIX: classPrefix,
	NAV: `${classPrefix}-nav`,
	CONTENT: `${classPrefix}-content`,
	TAB: `${classPrefix}-tab`,
	PANEL: `${classPrefix}-panel`,
	ACTIVE: `${classPrefix}-active`
});

class Tabs {
	static defaultOptions = {
		classPrefix: 'tabs',
		activeIndex: 0
	};

	constructor(options) {
		this.options = $.extend({}, Tabs.defaultOptions, options);
		this.element = $(this.options.element);
		this.fromIndex = this.options.activeIndex;

		this.events = new EventEmitter();
		this.selector = Selector(this.options.classPrefix);

		this._initElement();
		this._initTabs();
		this._initPanels();

		this._bindTabs();
	}

	/**
	 * [初始化元素属性]
	 * @return {[type]} [description]
	 */
	_initElement() {
			this.element.addClass(this.selector.PREFIX);
			this.tabs = $(this.options.tabs);
			this.panels = $(this.options.panels);
			this.nav = $(this.options.nav);
			this.content = $(this.options.content);

			this.length = this.tabs.length;
		}
		/**
		 * [初始化元素上的数据和样式]
		 * @return {[type]} [description]
		 */
	_initTabs() {
			this.nav && this.nav.addClass(this.selector.NAV);
			this.tabs.addClass(this.selector.TAB).each((index, tab) => {
				$(tab).data('value', index);
			});
			this.tabs.eq(this.fromIndex).addClass(this.selector.ACTIVE);
		}
		/**
		 * [初始化元素上的数据和样式]
		 * @return {[type]} [description]
		 */
	_initPanels() {
			this.content.addClass(this.selector.CONTENT);
			this.panels.addClass(this.selector.PANEL);
			this.panels.eq(this.fromIndex).addClass(this.selector.ACTIVE);
		}
		/**
		 * [绑定事件]
		 * @return {[type]} [description]
		 */
	_bindTabs() {
		this.tabs.click((e) => {
			const $el = $(e.target);
			if (!$el.hasClass(this.selector.ACTIVE)) { //当点击没有active类的li
				this.switchTo($el.data('value'));
			} else {
				return;
			}
		});
	}

	switchTo(toIndex) {
		this._switchTo(toIndex);
	}

	events(name) {
		return this.events;
	}

	_switchTo(toIndex) {
		const fromIndex = this.fromIndex;
		const panelInfo = this._getPanelInfo(toIndex);

		this._switchTabs(toIndex);
		this._switchPanel(panelInfo);
		this.events.emit('change', {
			toIndex,
			fromIndex
		});
		this.fromIndex = toIndex;
	}

	_getPanelInfo(toIndex) {
		const panels = this.panels;
		const fromIndex = this.fromIndex;

		let fromPanels, toPanels;
		if (fromIndex > -1) {
			fromPanels = this.panels.slice(fromIndex, (fromIndex + 1));
		}
		toPanels = this.panels.slice(toIndex, (toIndex + 1));
		return {
			toIndex: toIndex,
			fromIndex: fromIndex,
			toPanels: $(toPanels),
			fromPanels: $(fromPanels)
		};
	}

	_switchTabs(toIndex) {
		const tabs = this.tabs;
		const fromIndex = this.fromIndex;

		if (tabs.length < 1) {
			return;
		}
		tabs.eq(fromIndex)
			.removeClass(this.selector.ACTIVE)
			.attr('aria-selected', false);
		tabs.eq(toIndex)
			.addClass(this.selector.ACTIVE)
			.attr('aria-selected', true);
	}

	_switchPanel(panelInfo) {
		panelInfo.fromPanels.attr('aria-hidden', true).hide();
		panelInfo.toPanels.attr('aria-hidden', false).show();
	}

	destory() {
		this.events.removeAllListeners();
	}
}

export default Tabs;

/**
 * [使用]
 * @type {Tabs}
 */
const tab = new Tabs({
	element: '#tab-demo',
	tabs: '#tab-demo .tabs-nav li',
	panels: '#tab-demo .tabs-content div',
	nav: '#tab-demo .tabs-nav',
	content: '#tab-demo .tabs-content',
	activeIndex: 0
});
tab.events.on('change', (o) => {
	console.log(o);
});