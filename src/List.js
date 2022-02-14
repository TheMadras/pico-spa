function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function List(props) {
  return (
    <div className="list-component">
      <h3>{props.title}</h3>
      <div className="list-view">
        {
          props.items.map((item,i) => 
          <li key={i}>
            {item.temperature + " °F at " + timeConverter(item.timestamp)}
          </li>)
        }
      </div>
    </div>
  )
}

export default List