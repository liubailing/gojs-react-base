import go, { GraphObject } from '@octopus/gojs';
import { DiagramSetting, BaseColors, HoverColors, SelectedColors } from '../config';
import { DiagramEnum, HandleEnum } from '../enum';
import Base from './base';
import BaseChanges from './baseChanges';
import DrawTitle from './title';
import DrawSpot from './spot';

const $ = go.GraphObject.make;

export default class DrawLoop extends Base {
	callBack: Function;
	constructor(e: Function) {
		super();
		this.callBack = e;
	}

	getLoop(): go.Group {
		const $DrawSpot = new DrawSpot(this.callBack);
		return $(
			go.Group,
			'Auto',
			{
				layout: $(go.TreeLayout, {
					angle: 90,
					arrangement: go.TreeLayout.ArrangementHorizontal,
					layerSpacing: DiagramSetting.layerSpacing,
					arrangementSpacing: new go.Size(30, 10)
				}),
				mouseEnter: this.onMouseEnter,
				mouseLeave: this.onMouseLeave,
				// doubleClick: this.onSettingClick,
				movable: DiagramSetting.moveLoop,
				padding: new go.Margin(DiagramSetting.padding, 0, DiagramSetting.padding, 0),
				isSubGraphExpanded: true,
				resizable: false,
				computesBoundsAfterDrag: false,
				computesBoundsIncludingLinks: false,
				computesBoundsIncludingLocation: false,
				handlesDragDropForMembers: false,
				ungroupable: false,
				graduatedMax: 1,
				selectionChanged: this.doGroupCss_SelectionChanged
				// click: this.onClick
				// contextClick: this.onContextClick
			},
			$(go.Shape, 'RoundedRectangle', {
				name: 'group_main',
				parameter1: DiagramSetting.parameter1Group,
				fill: BaseColors.transparent,
				stroke: BaseColors.group_border,
				strokeWidth: 1
			}),
			$(
				go.Panel,
				'Vertical',
				{
					name: 'group_body',
					background: BaseColors.group_bg,
					defaultAlignment: go.Spot.Left,
					cursor: 'pointer'
				},
				$(
					go.Panel,
					'Horizontal',
					{
						padding: 5
					},
					$('SubGraphExpanderButton', {
						alignment: go.Spot.Center,
						// "_buttonExpandedFigure": "M0 0 L10 0",
						// "_buttonCollapsedFigure": "M0 5 L10 5 M5 0 L5 10",
						"ButtonIcon.stroke": BaseColors.font,
						// "Button.fill": "blue",
						// "ButtonBorder.opacity": 0.5
						// height: 16
						// "_subGraphExpandedFigure": "TriangleUp",
						// "_subGraphCollapsedFigure": "TriangleDown",
						// _buttonFill:BaseColors.transparent,
						"ButtonBorder.fill": BaseColors.background,
						"ButtonBorder.stroke": BaseColors.transparent,
						// "_buttonFillNormal": "red",
						// "_buttonStrokeNormal": "red",
						"_buttonFillOver":SelectedColors.background,
						"_buttonStrokeOver": BaseColors.transparent,
						// "ButtonIcon.strokeOver":"red",
						"_buttoniconStrokeOver": "red",
						// click: function(e:any, obj:any) {
						// 	// debugger
						// 	// if(obj.panel.data) {
						// 	// 	obj.findObject('ButtonIcon').fill = '#fb7e00';
						// 	// 	obj._buttonFillOver = "#fb7e00";
						// 	// } else {
						// 	// 	obj._buttonFillNormal = "#red";
						// 	// 	obj._buttonFillOver = "#dadada";
						// 	// }
						// 	// return true
						// }
						
					}),
					DrawTitle.getTitle(DiagramEnum.LoopGroup),
					$(
						go.Panel,
						'Horizontal',
						$(
							go.TextBlock,
							{
								...{
									editable: DiagramSetting.renameable,
									font: DiagramSetting.font,
									textEdited: (thisTextBlock: go.TextBlock, oldString: string, newString: string) => {
										// todo 1
										// this.props.store.iFlowchart.onSaveNodeNameHandler(newString);
									}
								}
							},
							new go.Binding('text', "tttest"),
							// new go.Binding('stroke', 'isSelected', this.getNodeStroke).ofObject()
						)
					)
				),
				// create a placeholder to represent the area where the contents of the group are
				$(go.Placeholder, {
					background: BaseColors.group_panel_bg,
					padding: new go.Margin(10, 8),
					minSize: new go.Size(DiagramSetting.ConditionWidth, DiagramSetting.groupHeight)
				})
			), // end Vertical Panel
			$DrawSpot.getSpotLoopInfo(),
			$DrawSpot.getSpot(DiagramEnum.LoopGroup)
		);
	}

	/**
	 * 点击展示循环列表具体内容
	 */
	private onListClick = async (_e: go.InputEvent, _obj: GraphObject) => {
		this.doFlowchartEvent(_e, _obj, HandleEnum.ShowNodeInfo, this.callBack);
	};

	/**
	 *
	 */
	private onListMouseEnter = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			if (_obj) {
				const node = (_obj as any).part;
				if (node) {
					const list = node.findObject('node_Ilist');
					if (list) {
						list.visible = false;
					}
					const listHover = node.findObject('node_Ilist_Hover');
					if (listHover) {
						listHover.visible = true;
					}
				}
			}
		} catch (e) { }
	};

	/**
	 *
	 */
	private onListMouseLeave = (_e: go.InputEvent, _obj: GraphObject, _obj1: GraphObject): void => {
		try {
			// this.changeNodeInfoOpacity(1);
			if (_obj) {
				const node = (_obj as any).part;
				if (node) {
					const list = node.findObject('node_Ilist');
					if (list) {
						list.visible = true;
					}
					const listHover = node.findObject('node_Ilist_Hover');
					if (listHover) {
						listHover.visible = false;
					}
				}
			}
		} catch (e) { }
	};

	onMouseLeave = (_e: go.InputEvent, obj: GraphObject): void => {
		const node = (obj as any).part;
		if (node && node.diagram && !node.isSelected) {
			BaseChanges.setGroupCss(node, false);
			BaseChanges.setListCss(node, false);
			BaseChanges.setActionCss(node, false);
		}
	};

	onMouseEnter = (_e: go.InputEvent, obj: GraphObject): void => {
		const node = (obj as any).part;
		if (node && node.diagram && !node.isSelected) {
			BaseChanges.setGroupCss(node, true);
			BaseChanges.setListCss(node, true);
			BaseChanges.setActionCss(node, true);
		}

		if (node && node.data) {
			this.doFlowchartEvent(_e, obj, HandleEnum.MouseEnter, this.callBack);
		}
	};
}

// const drawLoop = new DrawLoop();

// export default drawLoop;
