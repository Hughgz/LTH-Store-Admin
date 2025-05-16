import { PowerBIEmbed } from 'powerbi-client-react';
import { models, Report } from 'powerbi-client';
import { useState } from 'react';
import Sidebar from '../components/Sidebar'; 

const Dashboard = () => {
  const [report, setReport] = useState<Report | null>(null);  

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-[100%] h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">DASHBOARD</h1>
          <div className="h-full w-[10.5rem] lg:w-4/5 xl:w-3/4 2xl:w-2/3 p-1 bg-white rounded-lg shadow-md dark:bg-gray-700">
            <PowerBIEmbed
              embedConfig={{
                type: 'report',   
                id: '7b5b7def-f4fa-414d-b2ce-8927f40d7867',
                embedUrl: "https://app.powerbi.com/reportEmbed?reportId=7b5b7def-f4fa-414d-b2ce-8927f40d7867&groupId=a8befdae-18fa-46dc-b57e-cbe9db32f3d1&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUVBU1QtQVNJQS1ELVBSSU1BUlktcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQi...",
                accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMzg1MmJmNzUtMmZkNy00ZDRjLTljMGMtMDYyZTJkMzEzNjY3LyIsImlhdCI6MTc0NjUyOTkyMiwibmJmIjoxNzQ2NTI5OTIyLCJleHAiOjE3NDY1MzQ3NTksImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBWFFBaS84WkFBQUErL0NCV2l3RDZFUzEyblZTcHN2dDJQbTEya05Dc0s3R2o3T3dUZlVOQWtQSTBodlBkRzVJWFB2Q3c3aVg3a2FlMjgxbllybzNyWWJvS0k3dXhsZXFxTHIrU25YdTNGMTgrc2l0ZWsxYUFibThkZUVWWSs4dmRZRE1tcEV6R2NJQ3hmanh6Y2l4SzJOcUpocHhyZE5IWWc9PSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwaWQiOiIxOGZiY2ExNi0yMjI0LTQ1ZjYtODViMC1mN2JmMmIzOWIzZjMiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6Ik5ndXllbiIsImdpdmVuX25hbWUiOiJUYWkiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIyMDMuMjA1LjI5LjEwNiIsIm5hbWUiOiJUYWkgTmd1eWVuIiwib2lkIjoiY2JhNTFhZTUtMGYwZC00YTczLWEwZmMtMzYxZWY4ZWIwNzljIiwicHVpZCI6IjEwMDMyMDA0OTc3RUQyMjAiLCJyaCI6IjEuQWNZQWRiOVNPTmN2VEUyY0RBWXVMVEUyWndrQUFBQUFBQUFBd0FBQUFBQUFBQURwQUJqR0FBLiIsInNjcCI6IkFwcC5SZWFkLkFsbCBDYXBhY2l0eS5SZWFkLkFsbCBDYXBhY2l0eS5SZWFkV3JpdGUuQWxsIENvbm5lY3Rpb24uUmVhZC5BbGwgQ29ubmVjdGlvbi5SZWFkV3JpdGUuQWxsIENvbnRlbnQuQ3JlYXRlIERhc2hib2FyZC5SZWFkLkFsbCBEYXNoYm9hcmQuUmVhZFdyaXRlLkFsbCBEYXRhZmxvdy5SZWFkLkFsbCBEYXRhZmxvdy5SZWFkV3JpdGUuQWxsIERhdGFzZXQuUmVhZC5BbGwgRGF0YXNldC5SZWFkV3JpdGUuQWxsIEdhdGV3YXkuUmVhZC5BbGwgR2F0ZXdheS5SZWFkV3JpdGUuQWxsIEl0ZW0uRXhlY3V0ZS5BbGwgSXRlbS5FeHRlcm5hbERhdGFTaGFyZS5BbGwgSXRlbS5SZWFkV3JpdGUuQWxsIEl0ZW0uUmVzaGFyZS5BbGwgT25lTGFrZS5SZWFkLkFsbCBPbmVMYWtlLlJlYWRXcml0ZS5BbGwgUGlwZWxpbmUuRGVwbG95IFBpcGVsaW5lLlJlYWQuQWxsIFBpcGVsaW5lLlJlYWRXcml0ZS5BbGwgUmVwb3J0LlJlYWRXcml0ZS5BbGwgUmVwcnQuUmVhZC5BbGwgU3RvcmFnZUFjY291bnQuUmVhZC5BbGwgU3RvcmFnZUFjY291bnQuUmVhZFdyaXRlLkFsbCBUYWcuUmVhZC5BbGwgVGVuYW50LlJlYWQuQWxsIFRlbmFudC5SZWFkV3JpdGUuQWxsIFVzZXJTdGF0ZS5SZWFkV3JpdGUuQWxsIFdvcmtzcGFjZS5HaXRDb21taXQuQWxsIFdvcmtzcGFjZS5HaXRVcGRhdGUuQWxsIFdvcmtzcGFjZS5SZWFkLkFsbCBXb3Jrc3BhY2UuUmVhZFdyaXRlLkFsbCIsInNpZCI6IjAwNGQzZDg5LTViMmItYTJlNi0wYzM4LTcxOWNkN2FmNDJjOSIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IkY5N3V2YW9USlp5b0NUODNaU2o0WDJST3ZOck5ReWlRRFZDR0NpYWo2RlEiLCJ0aWQiOiIzODUyYmY3NS0yZmQ3LTRkNGMtOWMwYy0wNjJlMmQzMTM2NjciLCJ1bmlxdWVfbmFtZSI6IlRhaU5ndXllbkBMVEgxOTAyLm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6IlRhaU5ndXllbkBMVEgxOTAyLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6InktWDBTRVZtcTBtOGo0ZllwOWFGQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfaWRyZWwiOiIxIDE2IiwieG1zX3BsIjoidmkifQ.FwuL67HJkmLJ1vZHT22fzNccRYw3Wc1V36P_WRAle0KHR4zjPBRdedgAX_IMYRUYq3g6KShJ1gspojPNXvRa5Mlietce0bJaXaydJjsmDtOyQXBiWEnB5_pLH7vg_FqEs0Eruu7gbyWu-JMMAifxHPHEUdchrtw80HeRgX8CfFBro_JBnV_GEME7CfCyhP9z2_F58D4tMycvsoNz8CrZdlCxwIxiJNdDTXTeQKLa5xJ_xKvXGKpcyBl3y6xJaPMNhVCkFiUJj9ORnUqu7qgjU8sQT2endjcdZJprZqHAKAQo89tyFasDV3THhYzE_vzv8D9JJhLxEbNXiCKLqEACrQ',
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
              cssClassName={"reportClass w-full h-full "}
              getEmbeddedComponent={(embeddedReport) => {
                if (embeddedReport) {
                  setReport(embeddedReport as Report);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
