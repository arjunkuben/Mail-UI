import React, { Component } from 'react';
import './App.css';

import { connect } from 'react-redux';
import { utilAction, deleteAction, readedAction, setFlagAction } from './redux/actions/utilAction';

class App extends Component {

	constructor() {
		super();
		this.state = {
			selectedCategory: 'inbox',
			mailContent: {},
			flagFilter: false
		};

		this.switchCategory = this.switchCategory.bind(this);
		this.showMailContent = this.showMailContent.bind(this);
		this.showFilter = this.showFilter.bind(this);
		this.deleteContent = this.deleteContent.bind(this);
	}

	componentDidMount() {
		this.props.getAllMails();
	}

	switchCategory(catalog) {
		this.setState({
			selectedCategory: catalog,
			mailContent: {},
			flagFilter: false
		});
	}

	showMailContent(mailData) {
		this.setState({
			mailContent: mailData
		}, () => {
			if (this.state.mailContent.unread) {
				const readedData = {
					mailId: this.state.mailContent.mId,
					catalog: this.state.selectedCategory
				};
				this.props.readedContent(readedData);
			}
		});
	}

	showFilter(type) {
		switch (type) {
			case 'flag':
				this.setState({ flagFilter: true });
				break;			
			case 'all':
				this.setState({ flagFilter: false });
				break;
			default:
				this.setState({ flagFilter: false });
				break;
		}
	}

	deleteContent(data) {
		this.setState({
			mailContent: {}
		}, () => {
			this.props.moveToDelete(data);
		})
	}

	render() {

		let selectedMails = this.props[this.state.selectedCategory];

		if (this.state.flagFilter) {
			selectedMails = selectedMails.filter((value) => value.flagged);
		}

		const displayMails = selectedMails.map((mailData) => {
			let divClass = 'col-md-12 pad_0 borderDec mainMailDataBlock';
			let firstPara = 'headerMailData text-uppercase';
			let secondPara = 'blockPara';
			if (mailData.unread) {
				divClass += ' borderLeftDes';
				firstPara += ' font-weight-bold';
				secondPara += ' colorPara';
			}
			if (this.state.mailContent.mId === mailData.mId) {
				divClass += ' bgHov';	
			}
			return (
				<div className={divClass} key={mailData.mId}
						onClick={() => this.showMailContent(mailData)}>
					<p className={firstPara}>{mailData.mId}</p>
					<p className={secondPara}>{mailData.subject}</p>
					<p className="blockPara text-truncate">{mailData.content}</p>
				</div>
			);
		});

		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-12 commonPadding mailHeader">
						<i className="fas fa-th"></i>&nbsp;&nbsp;Mail
					</div>
					<div className="col-md-2 commonMailStyle">
						<p><i className="fas fa-angle-down"></i>&nbsp;&nbsp;Folder</p>
						<ul>
							<li onClick={() => this.switchCategory('inbox')} 
								className={this.state.selectedCategory === 'inbox' ? 'bgWhite' : ''}>
								<i className="fas fa-inbox"></i>&nbsp;&nbsp;Inbox
								{this.props.unReadCountInbox ? <span className="countBadge badge badge-dark">{this.props.unReadCountInbox}</span> : ''}
							</li>
							<li onClick={() => this.switchCategory('spam')}
								className={this.state.selectedCategory === 'spam' ? 'bgWhite' : ''}>
								<i className="fas fa-ban"></i>&nbsp;&nbsp;Spam
								{ this.props.unReadCountSpam ? <span className="countBadge badge badge-dark">{this.props.unReadCountSpam}</span> : ''}
							</li>
							<li onClick={() => this.switchCategory('delete')}
								className={this.state.selectedCategory === 'delete' ? 'bgWhite' : ''}>
								<i className="fas fa-trash-alt"></i>&nbsp;&nbsp;Deleted Items
								{ this.props.unReadCountDelete ? <span className="countBadge badge badge-dark">{this.props.unReadCountDelete}</span> : ''}
							</li>
							<li onClick={() => this.switchCategory('custom')}
								className={this.state.selectedCategory === 'custom' ? 'bgWhite' : ''}>
								<i className="fas fa-folder"></i>&nbsp;&nbsp;Custom Folder
								{ this.props.unReadCountCustom ? <span className="countBadge badge badge-dark">{this.props.unReadCountCustom}</span> : ''}
							</li>
						</ul>
					</div>
					<div className="col-md-3 commonMailStyle mainMail pad_0">
						<div className="dropdown headerMail borderDec">
							Mails
							<button className="btn btn-light dropdown-toggle pad_0 text-right" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<i className="fas fa-filter"></i>&nbsp;&nbsp;Filter
							</button>
							<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<span className="dropdown-item" onClick={() => this.showFilter('all')} href="#">All Mails</span>
								<span className="dropdown-item" onClick={() => this.showFilter('flag')} href="#">Flag Mails</span>
							</div>
						</div>
						{displayMails}
					</div>
					<div className="col-md-7 commonMailStyle">
						{
							Object.keys(this.state.mailContent).length ? 
							<React.Fragment>
								<p className="padBot9 font-weight-bold">{this.state.mailContent.subject}</p>
								<div className="card">
									<div className="card-header text-uppercase">
										{this.state.mailContent.mId}
										<div className="text-right">
											<button type="button" className="btn btn-light">Reply</button>
											<button type="button" className="btn btn-light">Forward</button>
											{ this.state.selectedCategory !== 'delete' ? 
												<button type="button" onClick={() => this.deleteContent({ mailId: this.state.mailContent.mId, catalog: this.state.selectedCategory})} className="btn btn-light">
													<i className="fas fa-trash-alt"></i>&nbsp;&nbsp;Delete
												</button>
												: ''
											}
											<button type="button" onClick={() => this.props.setFlag({ mailId: this.state.mailContent.mId, catalog: this.state.selectedCategory})}  className="btn btn-light">
												<i className="fas fa-flag"></i>&nbsp;&nbsp; { this.state.mailContent.flagged ? 'UnFlag' : 'Flag'}
											</button>
										</div>
									</div>
									<div className="card-body">
										<p className="card-text" dangerouslySetInnerHTML={{ __html: this.state.mailContent.content}}></p>
									</div>
								</div>
							</React.Fragment> 
								:
							<div className="row h-100 justify-content-center align-items-center">
								Please select mail to view
						   	</div>
						}

					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	inbox: state.utilReducer.inbox,
	spam: state.utilReducer.spam,
	delete: state.utilReducer.delete,
	custom: state.utilReducer.custom,
	unReadCountInbox: getUnReadCount(state.utilReducer.inbox),
	unReadCountSpam: getUnReadCount(state.utilReducer.spam),
	unReadCountDelete: getUnReadCount(state.utilReducer.delete),
	unReadCountCustom: getUnReadCount(state.utilReducer.custom)
})

const getUnReadCount = (arr) => {
	return arr.filter((val) => val.unread).length
}

const mapDispatchToProps = dispatch => ({
	getAllMails: () => dispatch(utilAction()),
	moveToDelete: (reqData) => dispatch(deleteAction(reqData)),
	readedContent: (reqData) => dispatch(readedAction(reqData)),
	setFlag: (reqData) => dispatch(setFlagAction(reqData))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
