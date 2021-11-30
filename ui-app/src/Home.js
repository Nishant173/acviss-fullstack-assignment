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
const AUTH_TOKEN = "4812fe61775528fb206dc029fa3001d241a843eb"
// 4812fe61775528fb206dc029fa3001d241a843eb-ddd31ad7052874b04d7ca90078a9d5ef76cd862a


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
            codesData: {},
            codesDataPostApiStatus: null,

            batchName: null,
            numCodesToCreate: null,
        }

        this.postCodesData = this.postCodesData.bind(this)
        this.setBatchName = this.setBatchName.bind(this)
        this.setNumCodesToCreate = this.setNumCodesToCreate.bind(this)
    }

    fetchCodesData() {
        axios.get(CODES_API_URL, {
            params: {
                token: AUTH_TOKEN,
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
                token: AUTH_TOKEN,
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

    componentDidMount() {
        this.fetchCodesData()
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (prevState !== this.state) {
    //         this.fetchCodesData()
    //     }
    // }

    setBatchName(event) {
        this.setState({
            batchName: event.target.value,
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
        
        console.log(codesData)
        
        return (
            <React.Fragment>
                <form>
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