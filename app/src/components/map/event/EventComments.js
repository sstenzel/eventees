import React, { Component } from "react";
import Textarea from "./../../form/Textarea";

import commentIcon from "./../../../assets/icons/event/comment.svg";
import timeIcon from "./../../../assets/icons/event/time.svg";

import { AppContext } from "./../../AppContext";

const API_EVENT = "http://localhost:8000/event";
const API_COMMENT = "http://localhost:8000/comment";

class EventComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventComments: [],
      event_comment: ""
    };
  }

  componentDidMount() {
    this.getEventComments();
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
  };

  getEventComments = () => {
    fetch(`${API_EVENT}/comments/${this.props.eventId}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        api_token: this.context.token
      }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.setState({ eventComments: res });
      });
  };

  addComment = e => {
    e.preventDefault();

    let postData = {
      event_id: parseInt(this.props.eventId),
      content: this.state.event_comment
    };

    fetch(API_COMMENT, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        api_token: this.context.token
      },
      body: JSON.stringify(postData)
    })
      .then(res => {
        res.json();
        console.log(res);
        if (res.status === 200) {
          this.getEventComments();
          this.setState({ event_comment: "" });
        } else {
          this.context.showInfo(false);
        }
      })
      .catch(err => {
        this.context.showInfo(false);
      });
  };

  deleteComment = commentId => {
    fetch(`${API_COMMENT}/${commentId}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        api_token: this.context.token
      }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.setState({
          eventComments: this.state.eventComments.filter(
            comment => comment.id !== commentId
          )
        });
      });
  };

  blockComment = (commentId) => {};

  render() {
    return (
      <div className="map-section__content__element folded">
        <h4
          className="heading active"
          onClick={this.context.animateSectionElement}
        >
          Komentarze
        </h4>
        <div
          className="map-section-event__comments"
          style={{ display: "none" }}
        >
          {this.state.eventComments.length > 0 ? (
            this.state.eventComments.map((comment, index) => (
              <div className="single-comment row" key={index}>
                <div className="single-comment__image col-2">
                  <img
                    src={`http://localhost:8000/uploads/images/${comment.author_avatar.split("/").slice(-1)[0]}`}
                    alt="autor avatar"
                  />
                </div>
                <div className="single-comment__content col-10">
                  <h6>{comment.author_login}</h6>
                  <p>{comment.content}</p>
                </div>
                <div className="single-comment__info col-12">
                  <div className="date">
                    <img src={timeIcon} alt="data ikona" />
                    <p>
                      {new Intl.DateTimeFormat("pl-PL", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                      }).format(new Date(comment.created_at))}
                    </p>
                  </div>
                  <div className="single-comment__info__buttons">
                    {this.context.isAdmin ? (
                      <>
                        <span
                          className="block-comment"
                          onClick={() => this.blockComment(comment.id)}
                        >
                          zablokuj
                        </span>
                        <span
                          className="delete-comment"
                          onClick={() => this.deleteComment(comment.id)}
                        >
                          usuń
                        </span>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "left" }}>
              Nikt jeszcze nic nie napisał... :(
            </p>
          )}
          <form onSubmit={this.addComment}>
            <div className="row">
              <Textarea
                icon={commentIcon}
                title="Wiadomość"
                name="event_comment"
                placeholder="Wpisz wiadomość"
                onChange={this.handleChange}
                value={this.state.event_comment}
              />
            </div>
            <div className="button__outer">
              <button type="submit" name="userAddComment">
                Dodaj komentarz
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

EventComments.contextType = AppContext;

export default EventComments;
