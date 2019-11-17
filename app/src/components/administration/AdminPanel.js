import React, { Component } from "react";
import userIcon from "./../../assets/icons/admin/user.svg";
import eventIcon from "./../../assets/icons/admin/event.svg";
import commentIcon from "../../assets/icons/admin/comment.svg";
// import arrowDownIcon from "../../assets/icons/admin/down-arrow.svg";
// import arrowUpIcon from "../../assets/icons/admin/up-arrow.svg";
import arrowRightIcon from "../../assets/icons/admin/arrow-right.svg";
import arrowLeftIcon from "../../assets/icons/admin/arrow-left.svg";
import lockIcon from "../../assets/icons/admin/lock.svg";
import unlockIcon from "../../assets/icons/admin/unlock.svg";
import { AppContext } from "./../AppContext";


const API_GET_USERS = "http://localhost:8000/admin/getUserPagination";
const API_GET_EVENTS = "http://localhost:8000/admin/getEventPagination";
const API_GET_COMMENTS = "http://localhost:8000/admin/getCommentPagination";
const API_BLOCK_USER = "http://localhost:8000/admin/blockUser";
const API_RESTORE_USER = "http://localhost:8000/admin/restoreUser";
const API_BLOCK_EVENT = "http://localhost:8000/admin/blockEvent";
const API_BLOCK_COMMENT = "http://localhost:8000/admin/blockComment";



class AdminPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visiblePanel: "userPanel",
            scope: 10,
            page: 1,
            lastPage: 'false',
            users: null,
            events: null,
            comments: null
        }

        this.fetchUsers = this.fetchUsers.bind(this);
        this.fetchEvents = this.fetchEvents.bind(this);
        this.fetchComments = this.fetchComments.bind(this);
        this.onChangePageClick = this.onChangePageClick.bind(this);
        this.onEventBlockClick = this.onEventBlockClick.bind(this);
        this.onCommentBlockClick = this.onCommentBlockClick.bind(this);

    }

    componentWillMount() {
        this.fetchUsers();
    };

    fetchUsers() {
        fetch(`${API_GET_USERS}/${this.state.page}/${this.state.scope}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                api_token: this.context.token
            }
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    lastPage: res.meta.lastPage,
                    users: res.users
                });
            })
            .catch(err => console.log(err));
        console.log("fetchin");
        console.log(this.state.page);
    }

    fetchEvents() {
        fetch(`${API_GET_EVENTS}/${this.state.page}/${this.state.scope}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                api_token: this.context.token
            }
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    lastPage: res.meta.lastPage,
                    events: res.events
                });
            })
            .catch(err => console.log(err));
    }


    fetchComments() {
        fetch(`${API_GET_COMMENTS}/${this.state.page}/${this.state.scope}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                api_token: this.context.token
            }
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    lastPage: res.meta.lastPage,
                    comments: res.comments
                });
            })
            .catch(err => console.log(err));
    }

    clearState = () => {
        this.setState({
            users: null,
            events: null,
            comments: null,
            page: 1,
            lastPage: false
        });
    }


    onUserBlockClick = ($id, $blocked) => {

        fetch(
            $blocked ?
                `${API_RESTORE_USER}/${$id}`
                : `${API_BLOCK_USER}/${$id}`
            , {
                method: "put",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    api_token: this.context.token
                },
                body: JSON.stringify({"reason": "x"})
            })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.status === "OK") {
                    this.fetchUsers();
                }
            });
    };

    onEventBlockClick = ($id, $blocked) => {
        if ($blocked) {
            return;
        }
        fetch(
            `${API_BLOCK_EVENT}/${$id}`, {
                method: "put",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    api_token: this.context.token
                },
                body: JSON.stringify({"reason": "x"})
            })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.status === "OK") {
                    this.fetchEvents();
                }
            });
    };


    onCommentBlockClick = ($id, $blocked) => {
        if ($blocked) {
            return;
        }
        fetch(
            `${API_BLOCK_COMMENT}/${$id}`, {
                method: "put",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    api_token: this.context.token
                },
                body: JSON.stringify({"reason": "x"})
            })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.status === "OK") {
                    this.fetchComments();
                }
            });
    };

    onChangePanelClick = async ($panel) => {
        await this.clearState();
        await this.setState({
            visiblePanel: $panel,
        });

        if( this.state.visiblePanel === 'userPanel' ){
            this.fetchUsers();
        } else if (this.state.visiblePanel === 'eventPanel') {
            this.fetchEvents();
        } else {
            this.fetchComments();
        }
    };


    onChangePageClick = ($direction) => {
        console.log("changing page ");
        console.log($direction);

        if( this.state.page + $direction < 1){
            console.log("page less than one ");

            this.setState({
                lastPage: false
            });

        } else if (!($direction === 1 && this.state.lastPage)) {
          this.changePage($direction);
        }

    };

    changePage = async ($direction) => {
        await this.setState({
            page: this.state.page + $direction
        });

        if (this.state.visiblePanel === 'userPanel') {
            return this.fetchUsers();
        } else if (this.state.visiblePanel === 'eventPanel') {
            return this.fetchEvents();
        } else {
            return this.fetchComments();
        }
    };

    visibility = ($panel) => {
        return this.state.visiblePanel === $panel ? "administration" : "administration__hidden";
    };

  render() {
    return (
      <div className="admin-panel row">
        <div className="nav">
            <div className="title">
                <h1>PANEL ADMINA</h1>
            </div>
            <div className="option-icons">
                <div className="option-icon"
                     onClick={() => this.onChangePanelClick("userPanel")}>
                    <img src={userIcon} alt="Użytkownicy" />
                </div>
                <div className="option-icon"
                     onClick={() => this.onChangePanelClick("eventPanel")}>
                <img src={eventIcon} alt="Wydarzenia" />
            </div>
                <div className="option-icon"
                     onClick={() => this.onChangePanelClick("commentPanel")}>
                    <img src={commentIcon} alt="Komentarze" />
                </div>
            </div>
          </div>



          <div className={this.visibility("userPanel")} id="user">
              <table>
                  <thead>
                      <tr>
                          <th>Login</th>
                          <th>Email</th>
                          <th>Zablokowany</th>
                      </tr>
                  </thead>
                  <tbody>
                  {this.state.users ? (
                      this.state.users.map((user, key) => (
                          <tr key={key}>
                              <td>{user.login}</td>
                              <td>{user.email}</td>
                              <td>
                                  {user.blocked ? (
                                      <img src={lockIcon} alt="Odblokuj"
                                           onClick={() => this.onUserBlockClick(user.id, true)}/>
                                  ) : (
                                      <img src={unlockIcon} alt="Zablokuj"
                                           onClick={() => this.onUserBlockClick(user.id, false)}/>
                                  )}
                              </td>
                          </tr>
                      ))
                  ) : (
                      <></>
                  )}
                  </tbody>
              </table>

              <div className="pagination">
                  <img src={arrowLeftIcon} alt="Poprzednia strona"
                    onClick={() => this.onChangePageClick(-1)} />
                 <h3> strona: {this.state.page}</h3>
                  <img src={arrowRightIcon} alt="Następna strona"
                       onClick={() => this.onChangePageClick(1)} />
              </div>

          </div>
          <div className={this.visibility("eventPanel")} id='event'>

              <table>
                  <thead>
                  <tr>
                      <th>Nazwa</th>
                      <th>Czas</th>
                      <th>Data</th>
                      <th>Miejsce</th>
                      <th>Autor</th>
                      <th>Zablokuj</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.state.events ? (
                      this.state.events.map((event, key) => (
                          <tr key={key}>
                              <td>{event.name}</td>
                              <td>{event.time}</td>
                              <td>{event.date}</td>
                              <td>{event.adress_description}</td>
                              <td>{event.author}</td>
                              <td>
                                  {event.blocked ? (
                                      <img src={lockIcon} alt="Odblokuj"/>
                                  ) : (
                                      <img src={unlockIcon} alt="Zablokuj"
                                           onClick={() => this.onEventBlockClick(event.id, false)}/>
                                  )}
                              </td>
                          </tr>
                      ))
                  ) : (
                      <></>
                  )}
                  </tbody>
              </table>



              <div className="pagination">
                  <img src={arrowLeftIcon} alt="Poprzednia strona"
                       onClick={() => this.onChangePageClick(-1)} />
                  <h3> strona: {this.state.page}</h3>
                  <img src={arrowRightIcon} alt="Następna strona"
                       onClick={() => this.onChangePageClick(1)} />
              </div>
          </div>
          <div className={this.visibility("commentPanel")} id='comment'>
                  <table>
                      <thead>
                      <tr>
                          <th>Autor</th>
                          <th>Wydarzenie</th>
                          <th>Treść</th>
                      </tr>
                      </thead>
                      <tbody>
                      {this.state.comments ? (
                          this.state.comments.map((comment, key) => (
                              <tr key={key}>
                                  <td>{comment.author}</td>
                                  <td>{comment.event}</td>
                                  <td>{comment.content}</td>
                                  <td>
                                      {comment.blocked ? (
                                          <img src={lockIcon} alt="Odblokuj" />
                                      ) : (
                                          <img src={unlockIcon} alt="Zablokuj"
                                               onClick={() => this.onCommentBlockClick(comment.id, false)}/>
                                      )}
                                  </td>
                              </tr>
                          ))
                      ) : (
                          <></>
                      )}
                      </tbody>
                  </table>

                  <div className="pagination">
                      <img src={arrowLeftIcon} alt="Poprzednia strona"
                           onClick={() => this.onChangePageClick(-1)} />
                      <h3> strona: {this.state.page}</h3>
                      <img src={arrowRightIcon} alt="Następna strona"
                           onClick={() => this.onChangePageClick(1)} />
                  </div>

              </div>
          </div>
    );
  }
}

AdminPanel.contextType = AppContext;
export default AdminPanel;
