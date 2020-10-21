import React from 'react';
import { Media, Breadcrumb, BreadcrumbItem, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
import { Fade, Stagger } from 'react-animation-components';

function RenderMenuItem({ dish, deleteFavorite }) {
    return(
        <Media tag="li">
            <Media left middle>
                <Media object src={baseUrl + dish.image} alt={dish.name} />
            </Media>
            <Media body className="ml-5">
                <Media heading>{dish.name}</Media>
                <p>{dish.description}</p>
                <Button outline color="danger" onClick={() => deleteFavorite(dish._id)}>
                    <span className="fa fa-times"></span>
                </Button>
            </Media>
        </Media>
    );
}

const Favorites = (props) => {

    if (props.favorites.isLoading) {
        return(
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.favorites.errMess) {
        return(
            <div className="container">
                <div className="row">
                    <h4>{props.favorites.errMess}</h4>
                </div>
            </div>
        )
    }
    else if (props.favorites.favorites) {
        const favorites = props.favorites.favorites.dishes.map((dish) => {
            return (
                <Fade in key={dish._id}>
                    <div className="col-12 mt-5">
                        <RenderMenuItem dish={dish} deleteFavorite={props.deleteFavorite} />
                    </div>
                </Fade>
            );
        });

        return(
            <div className="container">
                <div className="row">
                    <Media list>
                        <Stagger in>
                            {favorites}
                        </Stagger>    
                    </Media>
                </div>
            </div>
        );
    }
    else {
        return(
            <div className="container">
                <div className="row">
                    <h4>You have no favorites</h4>
                </div>
            </div>
        )
    }
}

export default Favorites;