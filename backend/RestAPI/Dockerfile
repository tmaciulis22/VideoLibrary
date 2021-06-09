FROM mcr.microsoft.com/dotnet/sdk AS build-env
WORKDIR /app

COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN sed -i 's/Server=.*"/Server=172.17.0.1,1433;Database=WeDontByte;User=sa;Password=Password@123"/g' appsettings.json
RUN dotnet publish -o out

FROM mcr.microsoft.com/dotnet/aspnet
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "backend.dll"]