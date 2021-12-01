import React from 'react'
import axios from 'axios'

import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const CODES_API_URL = "http://127.0.0.1:8000/api/v1/myapp/codes/"
const AUTH_TOKEN_API_URL = "http://127.0.0.1:8000/api/v1/myapp/token-auth/"


function BasicTable({ arrayOfObjects }) {
    const columnNames = Object.keys(arrayOfObjects[0])
    const classes = makeStyles({
        table: {
            minWidth: 500,
        },
    })

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {
                            columnNames.map((columnName) => (
                                <TableCell align="center">{ columnName }</TableCell>
                            ))
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        arrayOfObjects.map((obj) => (
                            <TableRow>
                                {
                                    columnNames.map((columnName) => (
                                        <TableCell align="center">{ obj[columnName] }</TableCell>
                                    ))
                                }
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}


class HomePage extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",

            codesData: {},
            codesDataPostApiStatus: null,

            batchName: null,
            numCodesToCreate: null,
        }

        this.handleAuthToken = this.handleAuthToken.bind(this)
        this.setUsername = this.setUsername.bind(this)
        this.setPassword = this.setPassword.bind(this)
        this.postCodesData = this.postCodesData.bind(this)
        this.setBatchName = this.setBatchName.bind(this)
        this.setNumCodesToCreate = this.setNumCodesToCreate.bind(this)
    }

    fetchCodesData() {
        axios.get(CODES_API_URL, {
            params: {
                token: localStorage.getItem("token"),
            }
        })
            .then(response => {
                if (response.data) {
                    this.setState({
                        codesData: response.data,
                    })
                }
                else {
                    this.setState({
                        codesData: {},
                    })
                }
            })
            .catch(error => {
                this.setState({
                    codesData: {},
                })
            })
    }

    postCodesData() {
        const { batchName, numCodesToCreate } = this.state
        axios.post(CODES_API_URL, {
            batch_name: batchName,
            num_codes_to_create: numCodesToCreate,
        }, {
            params: {
                token: localStorage.getItem("token"),
            }
        })
            .then(response => {
                if (response) {
                    this.setState({
                        codesDataPostApiStatus: response.status,
                    })
                }
                else {
                    this.setState({
                        codesDataPostApiStatus: null,
                    })
                }
            })
            .catch(error => {
                this.setState({
                    codesDataPostApiStatus: null,
                })
            })
    }

    handleAuthToken() {
        axios.post(AUTH_TOKEN_API_URL, {
            username: this.state.username,
            password: this.state.password,
        })
            .then(response => {
                if (response) {
                    if (response.data["token"]) {
                        localStorage.setItem("token", response.data["token"])
                    }
                    else {
                        // localStorage.setItem("token", null)
                    }
                }
                else {
                    // localStorage.setItem("token", null)
                }
            })
            .catch(error => {
                // localStorage.setItem("token", null)
            })
    }

    deleteAuthToken() {
        // localStorage.removeItem("token")
        // localStorage.clear()
    }

    componentDidMount() {
        this.fetchCodesData()
    }

    setBatchName(event) {
        this.setState({
            batchName: event.target.value,
        })
    }

    setUsername(event) {
        this.setState({
            username: event.target.value,
        })
    }

    setPassword(event) {
        this.setState({
            password: event.target.value,
        })
    }

    setNumCodesToCreate(event) {
        this.setState({
            numCodesToCreate: event.target.value,
        })
    }

    render() {
        const {
            codesData,
            codesDataPostApiStatus,
        } = this.state
        
        console.log("codesData...\n")
        console.log(codesData)
        
        return (
            <React.Fragment>
                <form>
                    <h3>Get auth token</h3>
                    <label>
                        Username: <input type="text" name="username" onChange={this.setUsername} />
                    </label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <label>
                        Password: <input type="password" name="password" onChange={this.setPassword} />
                    </label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button onClick={this.handleAuthToken}>Authorize me</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button onClick={this.deleteAuthToken}>Log me out</button>
                    <br /><br />

                    <h3>Create batch with codes</h3>
                    <br />
                    <label>
                        Batch name: <input type="text" name="batchName" onChange={this.setBatchName} />
                    </label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <label>
                        Number of codes: <input type="number" name="numCodesToCreate" onChange={this.setNumCodesToCreate} />
                    </label>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button onClick={this.postCodesData}>Submit</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button onClick={this.fetchCodesData}>Refresh table</button>
                </form>
                
                {
                    codesDataPostApiStatus === 201 ?
                        alert("Created codes")
                        : null
                }
                {
                    codesDataPostApiStatus === 500 ?
                        alert("Error while creating codes")
                        : null
                }
                <br />
                {
                    Object.keys(codesData).length > 0 && codesData['codes_data'].length > 0 ?
                        <>
                            <h3>Codes table</h3>
                            <BasicTable
                                arrayOfObjects={codesData['codes_data']}
                            />
                        </>
                        : null
                }
            </React.Fragment>
        )
    }
}

export default HomePage