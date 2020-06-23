/*
 *  Copyright (C) 1998-2020 by Northwoods Software Corporation. All Rights Reserved.
 */

import * as React from 'react';
import { observer } from 'mobx-react';
import Flowchart from '../flowchartDiagram';
import Workflow, { WorkflowHandle } from './workflowHandle';
import './base.css';
/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */
@observer
class WorkflowTest extends React.Component<{}> {
	componentDidMount() {
		Workflow.test('init');
	}

	render() {
		return (
			<>
				<div id="div-Main">
					<div className="div-flowchart">
						<Flowchart taskId="taskId" flowchart={Workflow.flowchart}></Flowchart>
					</div>
					<div className="div-logs">
						<ul>
							{Workflow.logs.reverse().map((x, i) => {
								return (
									<li className={'div-log-item'} key={x + i}>
										{x}
									</li>
								);
							})}
						</ul>
					</div>
				</div>

				<div className="divActions">
					<div id="div-actions" className="divActionItem" style={{ marginTop: '5px' }}>
						<div>
							<label>初始：</label>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('init');
								}}
							>
								初始化
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('getall');
								}}
							>
								得到全部
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								重新渲染
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								复杂模型
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('hide_contextMenu');
								}}
							>
								清除contextMenu
							</button>
						</div>
					</div>

					<div className="divActionItem">
						<div>
							<label>追加节点：</label>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('add_smiple');
								}}
							>
								新增节点
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('add_loop');
								}}
							>
								新增循环
							</button>
						</div>

						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								为循环追加打开网页
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								当前值追加条件节点
							</button>
						</div>

						<div>
							<button
								onClick={() => {
									Workflow.test('add_condition');
								}}
							>
								新增条件判断
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('add_branch');
								}}
							>
								新增一个条件分支
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('add_inner_loop');
								}}
							>
								循环追加一个节点
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('add_inner_branch');
								}}
							>
								分支追加一个节点
							</button>
						</div>
					</div>

					<div className="divActionItem">
						<div>
							<label>存取数据：</label>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								第一个节点存储Data
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								取出Data
							</button>
						</div>
					</div>

					<div className="divActionItem" style={{ marginTop: '10px' }}>
						<div>
							<label>流程图测试：</label>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								加载 测试流程图
							</button>
						</div>
						<div>
							<span>以下操作请在 “加载 测试流程图 ”之后进行操作 </span>
						</div>
					</div>
					<div className="divActionItem">
						<div>
							<label>选中节点：</label>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								选中第一个节点
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								选中 循环
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								选中 条件分支2,并触发onClick
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								选中 条件
							</button>
						</div>
					</div>
					<div className="divActionItem">
						<div>
							<label>重命名：</label>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								重命名当前选中节点
							</button>
						</div>
						<div>
							{' '}
							<div className="divActionItem">
								<div>
									<label>获取结点：</label>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('');
										}}
									>
										第一个节点
									</button>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('');
										}}
									>
										分支2的第一个节点
									</button>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('');
										}}
									>
										获取打开网页
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className="divActionItem">
						<div>
							<label>“值”操作：</label>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								取出node1的Data
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								取出node1的Data
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								改变 loop
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								再取出node1的Data
							</button>
						</div>
					</div>
					<div className="divActionItem">
						<div>
							<label>追加节点：</label>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								条件分支1增加条件分支(没实现)
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								追加到分支1
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								追加到分支2
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								追加到循环
							</button>
						</div>
						<div>
							{' '}
							<div className="divActionItem">
								<div>
									<label>追加节点2：</label>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('');
										}}
									>
										追加到循环(内部最前面)
									</button>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('');
										}}
									>
										追加到循环(内部最后面)
									</button>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('');
										}}
									>
										追加在循环(前面) 并选中
									</button>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('');
										}}
									>
										追加在循环(后面)
									</button>
								</div>
								<div>
									<button
										onClick={() => {
											Workflow.test('');
										}}
									>
										追加到循环(里面) 并选中
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className="divActionItem">
						<div>
							<label>删除节点：</label>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								删除节点
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								删除节点 循环
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								删除节点 条件分支2
							</button>
						</div>
						<div>
							<button
								onClick={() => {
									Workflow.test('');
								}}
							>
								删除节点 条件
							</button>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default WorkflowTest;
