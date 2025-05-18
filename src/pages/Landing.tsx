import { PowerBIEmbed } from 'powerbi-client-react';
import { models, Report } from 'powerbi-client';
import { useState } from 'react';
import Sidebar from '../components/Sidebar'; 

const Landing = () => {
  const [report, setReport] = useState<Report | null>(null);  

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Welcome to Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Access your analytics and insights in one place</p>
          </div>
          
          {/* Main Dashboard */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-all hover:shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Performance Overview</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                  Refresh
                </button>
                <button className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  Export
                </button>
              </div>
            </div>
            
            <div className="h-[450px] sm:h-[500px] md:h-[550px] w-full bg-white rounded-lg dark:bg-gray-700 overflow-hidden">
              <PowerBIEmbed
                embedConfig={{
                  type: 'report',   
                  id: '7b5b7def-f4fa-414d-b2ce-8927f40d7867',
                  embedUrl: "https://app.powerbi.com/reportEmbed?reportId=7b5b7def-f4fa-414d-b2ce-8927f40d7867&groupId=a8befdae-18fa-46dc-b57e-cbe9db32f3d1&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUVBU1QtQVNJQS1ELVBSSU1BUlktcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQi...",
                  accessToken : "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMzg1MmJmNzUtMmZkNy00ZDRjLTljMGMtMDYyZTJkMzEzNjY3LyIsImlhdCI6MTc0NzQ1NDA5NiwibmJmIjoxNzQ3NDU0MDk2LCJleHAiOjE3NDc0NTk0ODAsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBWFFBaS84WkFBQUFsSDcrZ3lDTUNHTjdpRGphYnlZMi9aVFRaYnQ5dTA1czAxdFV2dnJNZlRiVWZVc3o1aktkclNXWEJTQ3ZIQTBhL1ByU0tGT25UbzZWT05vdW9JZUtKT2Q1WmlpWnRtT3Y2eHVucWswT1lWZmlOR2xWazRGQzRwbkpEa21TbzBJdkJJQTBzOVRYbUNwdWFKL0VDUHRMVFE9PSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwaWQiOiIxOGZiY2ExNi0yMjI0LTQ1ZjYtODViMC1mN2JmMmIzOWIzZjMiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6Ik5ndXllbiIsImdpdmVuX25hbWUiOiJUYWkiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiI0Mi4xMTkuMjQwLjQwIiwibmFtZSI6IlRhaSBOZ3V5ZW4iLCJvaWQiOiJjYmE1MWFlNS0wZjBkLTRhNzMtYTBmYy0zNjFlZjhlYjA3OWMiLCJwdWlkIjoiMTAwMzIwMDQ5NzdFRDIyMCIsInJoIjoiMS5BY1lBZGI5U09OY3ZURTJjREFZdUxURTJad2tBQUFBQUFBQUF3QUFBQUFBQUFBRHBBQmpHQUEuIiwic2NwIjoiQXBwLlJlYWQuQWxsIENhcGFjaXR5LlJlYWQuQWxsIENhcGFjaXR5LlJlYWRXcml0ZS5BbGwgQ29ubmVjdGlvbi5SZWFkLkFsbCBDb25uZWN0aW9uLlJlYWRXcml0ZS5BbGwgQ29udGVudC5DcmVhdGUgRGFzaGJvYXJkLlJlYWQuQWxsIERhc2hib2FyZC5SZWFkV3JpdGUuQWxsIERhdGFmbG93LlJlYWQuQWxsIERhdGFmbG93LlJlYWRXcml0ZS5BbGwgRGF0YXNldC5SZWFkLkFsbCBEYXRhc2V0LlJlYWRXcml0ZS5BbGwgR2F0ZXdheS5SZWFkLkFsbCBHYXRld2F5LlJlYWRXcml0ZS5BbGwgSXRlbS5FeGVjdXRlLkFsbCBJdGVtLkV4dGVybmFsRGF0YVNoYXJlLkFsbCBJdGVtLlJlYWRXcml0ZS5BbGwgSXRlbS5SZXNoYXJlLkFsbCBPbmVMYWtlLlJlYWQuQWxsIE9uZUxha2UuUmVhZFdyaXRlLkFsbCBQaXBlbGluZS5EZXBsb3kgUGlwZWxpbmUuUmVhZC5BbGwgUGlwZWxpbmUuUmVhZFdyaXRlLkFsbCBSZXBvcnQuUmVhZFdyaXRlLkFsbCBSZXBydC5SZWFkLkFsbCBTdG9yYWdlQWNjb3VudC5SZWFkLkFsbCBTdG9yYWdlQWNjb3VudC5SZWFkV3JpdGUuQWxsIFRhZy5SZWFkLkFsbCBUZW5hbnQuUmVhZC5BbGwgVGVuYW50LlJlYWRXcml0ZS5BbGwgVXNlclN0YXRlLlJlYWRXcml0ZS5BbGwgV29ya3NwYWNlLkdpdENvbW1pdC5BbGwgV29ya3NwYWNlLkdpdFVwZGF0ZS5BbGwgV29ya3NwYWNlLlJlYWQuQWxsIFdvcmtzcGFjZS5SZWFkV3JpdGUuQWxsIiwic2lkIjoiMDA0ZDNkODktNWIyYi1hMmU2LTBjMzgtNzE5Y2Q3YWY0MmM5Iiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiRjk3dXZhb1RKWnlvQ1Q4M1pTajRYMlJPdk5yTlF5aVFEVkNHQ2lhajZGUSIsInRpZCI6IjM4NTJiZjc1LTJmZDctNGQ0Yy05YzBjLTA2MmUyZDMxMzY2NyIsInVuaXF1ZV9uYW1lIjoiVGFpTmd1eWVuQExUSDE5MDIub25taWNyb3NvZnQuY29tIiwidXBuIjoiVGFpTmd1eWVuQExUSDE5MDIub25taWNyb3NvZnQuY29tIiwidXRpIjoiaTBpM0RDMng4VXFMS1ZJc2EyNENBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiNjJlOTAzOTQtNjlmNS00MjM3LTkxOTAtMDEyMTc3MTQ1ZTEwIiwiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19pZHJlbCI6IjI0IDEiLCJ4bXNfcGwiOiJ2aSJ9.e8Z-x3i5YwczHYpQLwl0gcFmro6Ub2vCUZx8_keLRio3VwmMj0W7UTs2V1MUJlMRDL8KCSzp_4RQrBnEoS3yTU3nCjsyObF-bjwUHRw6ZspBknqddrtG2-iebWrILNqVA1_q9mVtEW93QidxQKfv8ZmgPvtPnjkjpvUkKCft9UBICnwNozGSkJs8ZDL_OkMBXs6df6dRU3nr5ijUm6283NOuYoXw1NksYVqhVvbRyaMUDiV3l4KqbMXyyemjuYgaSIXNXab5ytnk808G84QZTNkBG1-6edzfm5cb5lHGt1TYun2LPcjl7mkqdh7iIuudwceKCFqZ-Y3hq8NIy1srBg",
                  tokenType: models.TokenType.Aad,
                  settings: {
                    panes: {
                      filters: {
                        expanded: false,
                        visible: false
                      }
                    },
                    background: models.BackgroundType.Transparent,
                  }
                }}
                eventHandlers={
                  new Map([
                    ['loaded', function () { console.log('Report loaded'); }],
                    ['rendered', function () { console.log('Report rendered'); }],
                    ['error', function (event) { console.log(event?.detail); }],
                    ['visualClicked', () => console.log('visual clicked')],
                    ['pageChanged', (event) => console.log(event)],
                  ])
                }
                cssClassName={"reportClass w-full h-full"}
                getEmbeddedComponent={(embeddedReport) => {
                  if (embeddedReport) {
                    setReport(embeddedReport as Report);
                  }
                }}
              />
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Total Users', value: '3,721', change: '+15%', up: true },
              { title: 'Revenue', value: '$24,581', change: '+4.75%', up: true },
              { title: 'Engagement', value: '27.3%', change: '-2.1%', up: false },
              { title: 'Conversion', value: '5.4%', change: '+1.2%', up: true }
            ].map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
                <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{stat.value}</p>
                <div className={`flex items-center mt-2 ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                  <span>{stat.change}</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.up ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                  </svg>
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'View Reports', icon: '📊' },
                { name: 'Export Data', icon: '📤' },
                { name: 'User Management', icon: '👥' },
                { name: 'Settings', icon: '⚙️' }
              ].map((action, index) => (
                <button key={index} className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <span className="text-2xl mb-2">{action.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{action.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
