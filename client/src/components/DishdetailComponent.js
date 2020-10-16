import React, { Component } from 'react';
import { Card, CardImg, CardImgOverlay, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Row, Label, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

class CommentForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isModalOpen: false
		}
		
		this.toggleModal = this.toggleModal.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	toggleModal() {
		this.setState({
		  isModalOpen: !this.state.isModalOpen
		});
	}

	handleSubmit(values) {
		this.toggleModal();
		this.props.postComment(this.props.dishId, values.rating, values.comment);
	}

	render() {
		return (
			<React.Fragment>
				<Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span> Submit Comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                        <Row className="form-group">
                            <Col>
                            <Label htmlFor="rating">Rating</Label>
                            <Control.select model=".rating" id="rating" className="form-control">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Control.select>
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col>
                            <Label htmlFor="comment">Comment</Label>
                            <Control.textarea model=".comment" id="comment"
                                        rows="6" className="form-control" />
                            </Col>
                        </Row>
                        <Button type="submit" className="bg-primary">
                            Submit
                        </Button>
                    </LocalForm>
                </ModalBody>
               </Modal>
			</React.Fragment>
		);
	}

}

function RenderDish({dish, favorite, postFavorite}) {
	return(
		<div className="col-12 col-md-5 m-1">
			<Card>
				<CardImg top src={baseUrl + dish.image} alt={baseUrl + dish.image} />
				<CardImgOverlay>
					<Button outline color="primary" onClick={() => postFavorite(dish._id)}>
						{favorite ?
							<span className="fa fa-heart"></span>
							: 
							<span className="fa fa-heart-o"></span>
						}
					</Button>
				</CardImgOverlay>
				<CardBody>
					<CardTitle>{dish.name}</CardTitle>
					<CardText>{dish.description}</CardText>
				</CardBody>
			</Card>
		</div>
	);
}

function RenderComments({comments, postComment, dishId}) {
	if (comments != null)
		return(
			<div className="col-12 col-md-5 m-1">
				<h4>Comments</h4>
				<ul className="list-unstyled">
					{comments.map((comment) => {
						return (
							<li>
								<p>{comment.comment}</p>
								<p>{comment.rating} stars</p>
								<p>-- {comment.author.firstname} {comment.author.lastname} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day:'2-digit'}).format(new Date(Date.parse(comment.updatedAt)))}</p>
							</li>
						);
					})}
				</ul>
				<CommentForm dishId={dishId} postComment={postComment} />
			</div>
		);
	else
		return(
			<div></div>
		);
}

const DishDetail = (props) => {
    if (props.isLoading) {
		return (
			<div className="container">
				<div className="row">
					<Loading />
				</div>
			</div>
		);
	} else if (props.errMess) {
		return (
			<div className="container">
				<div className="row">
					<h4>{props.errMess}</h4>
				</div>
			</div>
		);
	} else if (props.dish != null) {
		return (
			<div className="container">
				<div className="row">
					<Breadcrumb>
						<BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
						<BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
					</Breadcrumb>
					<div className="col-12">
						<h3>{props.dish.name}</h3>
						<hr />
					</div>
				</div>
				<div className="row">
					<RenderDish dish={props.dish} favorite={props.favorite} postFavorite={props.postFavorite} />
					<RenderComments comments={props.comments}
						postComment={props.postComment}
						dishId={props.dish._id} />
				</div>
			</div>
		);
	} else {
		return (
			<div></div>
		);
	}
}

export default DishDetail;